import { findDomElement } from ".";

export default class Camera {
  #videoCanvasCtx = document.createElement("canvas").getContext("2d")!;
  #photoDestination = findDomElement<"img">(".capture > img");
  #videoPreview = findDomElement<"video">(".capture > video");

  #streaming = false;

  constructor() {
    this.setupCanvasRenderer();
    this.initialiseMediaDevice();
  }

  private get videoCanvasWidth() {
    return this.#videoCanvasCtx.canvas.width;
  }

  private get videoCanvasHeight() {
    return this.#videoCanvasCtx.canvas.height;
  }

  initialiseMediaDevice = async () => {
    // try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    this.#videoPreview.srcObject = stream;
    this.#videoPreview.play();
    // } catch (error) {
    //   console.error("Error starting the camera: ", error);
    // }
  };

  setupCanvasRenderer = () => {
    this.#videoPreview.addEventListener("canplay", () => {
      if (this.#streaming) return;

      const { videoWidth, videoHeight } = this.#videoPreview;

      this.#videoCanvasCtx.canvas.width = videoWidth;
      this.#videoCanvasCtx.canvas.height = videoHeight;
      this.clearImage();

      this.#streaming = true;
    });
  };

  clearImage = () => {
    this.#videoCanvasCtx.fillStyle = "#AAA";
    this.#videoCanvasCtx.fillRect(
      0,
      0,
      this.videoCanvasWidth,
      this.videoCanvasHeight,
    );

    const data = this.#videoCanvasCtx.canvas.toDataURL("image/png");
    this.#photoDestination.src = data;
  };

  captureImage = () => {
    if (!this.#streaming) return;

    this.#videoCanvasCtx.drawImage(
      this.#videoPreview,
      0,
      0,
      this.videoCanvasWidth,
      this.videoCanvasHeight,
    );

    // const data = this.#videoCanvasCtx.canvas.toDataURL("image/png");
    this.#videoCanvasCtx.canvas.toBlob((blob) => {
      this.#photoDestination.src = URL.createObjectURL(blob!);
    });
    // this.#photoDestination.src = data;
  };
}
