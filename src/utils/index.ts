export type Nullable<T> = T | null;

export function findDomElement<K extends keyof HTMLElementTagNameMap>(
  elemName: string,
  elemToQuery?: HTMLElement,
): HTMLElementTagNameMap[K];
export function findDomElement<K extends keyof HTMLElementTagNameMap>(
  elemName: string,
  elemToQuery?: HTMLElement,
  all?: boolean,
): NodeListOf<HTMLElementTagNameMap[K]>;
export function findDomElement<K extends keyof HTMLElementTagNameMap>(
  elemName: string,
  elemToQuery?: HTMLElement,
  all?: boolean,
): NodeListOf<HTMLElementTagNameMap[K]> | HTMLElementTagNameMap[K] {
  elemToQuery || (elemToQuery = document as unknown as HTMLElement);

  if (all !== undefined) {
    let result: Nullable<NodeListOf<HTMLElementTagNameMap[K]>>;

    if (
      (result =
        elemToQuery.querySelectorAll<HTMLElementTagNameMap[K]>(elemName)) ===
      null
    )
      throw Error("Queried DOM element that doesn't exist: " + elemName);

    return result;
  } else {
    let result: Nullable<HTMLElementTagNameMap[K]>;

    if (
      (result =
        elemToQuery.querySelector<HTMLElementTagNameMap[K]>(elemName)) === null
    )
      throw Error("Queried DOM element that doesn't exist: " + elemName);

    return result;
  }
}
