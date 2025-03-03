import { createWorker, OEM, PSM } from "tesseract.js";
import "./style.css";
import { findDomElement } from "./utils";
// import Camera from "./utils/Camera";

const captureButton = findDomElement<"button">(".camera > button");
const fileUploader = findDomElement<"input">("#image-upload");
const imageRenderer = findDomElement<"canvas">("#image-renderer");
const imageScannerBtn = findDomElement<"button">("#image-scan");

window.Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    console.log(cv);
  },
};
//Utils//////////

type ImageLike =
  | string
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement
  | CanvasRenderingContext2D
  | File
  | Blob
  | ImageData
  | BufferSource
  | OffscreenCanvas;

const clearImageRenderer = (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas;

  ctx.fillStyle = "#AAA";
  ctx.fillRect(0, 0, width, height);
};

// OCR

const setupDetection = async () => {
  const worker = await createWorker("eng", OEM.LSTM_ONLY, {}, {});
  worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK });

  return (image: ImageLike) =>
    worker.recognize(image, undefined, { debug: true });
};

// Image Renderer //////////

const updateImageRenderer = (() => {
  const ctx = imageRenderer.getContext("2d")!;

  return (image: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = image;

    const ratio = naturalWidth / naturalHeight;

    if (naturalWidth < naturalHeight) {
      ctx.canvas.height = 500;
      ctx.canvas.width = 500 / ratio;
    } else {
      ctx.canvas.height = 500 / ratio;
      ctx.canvas.width = 500;
    }

    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
  };
})();

// Files handling
fileUploader.addEventListener("change", () => {
  if (fileUploader.files?.length === 0) return;
  const image = new Image();
  const chosenFile = fileUploader.files![0];

  image.src = URL.createObjectURL(chosenFile);
  image.onload = () => updateImageRenderer(image);
});

const setupScanBtn = (cb: () => void) => {
  imageScannerBtn.disabled = false;
  imageScannerBtn.addEventListener("click", cb);
};

// Init

const init = () => {
  // cv.onload = () => console.log("Loaded OpenCV");
  setupDetection().then(async (detectText) => {
    setupScanBtn(async () => {
      const result = await detectText(imageRenderer);
      console.log(result.data);
    });
  });
};

init();
// const camera = new Camera();
//
// const setupDetection = async () => {
//   const worker = await createWorker("eng");
//   worker;
// };
//
// setupDetection();
//
// captureButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log("capturing...");
//   camera.captureImage();
// });

// setInterval(() => {
//   console.log("auto capture");
//   camera.captureImage();
// }, 2000);
