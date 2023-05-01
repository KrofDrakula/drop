interface Options<T> {
  /**
   * The function that will be called when files are dropped
   * onto the given element. When a `parse` function is provided,
   * the files will be transformed from `File` to whatever the
   * function returns.
   */
  onDrop: (files: T[]) => void;
  /**
   * An optional error handler that will capture errors produced
   * when calling the `parse` function.
   */
  onError?: (err: unknown) => void;
  /**
   * Allows transforming files before handing the results to the
   * `onDrop` function.
   */
  parse?: (file: File) => Promise<T>;
  /**
   * Fired when dragging files into the HTML element handling the
   * file drop event.
   */
  onDragOver?: (element: HTMLElement) => void;
  /**
   * Fired when the user drags files off of the HTML element handling
   * the file drop event. It is also triggered just before files
   * are dropped by the user and the `onDrop` handler fires.
   */
  onDragLeave?: (element: HTMLElement) => void;
}

/**
 * Attempts to parse the file as JSON content and returns the
 * parsed value.
 */
export const asJSON = async (
  file: File,
  reviver?: Parameters<typeof JSON.parse>[1]
) => {
  const content = await file.text();
  return JSON.parse(content, reviver);
};

/**
 * Returns the contents of a file as a string.
 */
export const asText = async (file: File) => file.text();

const getFilesFromDataTransfer = (dt: DataTransfer): File[] => {
  if (dt.items) {
    const files: File[] = [];
    for (const item of Array.from(dt.items))
      if (item.kind == "file") files.push(item.getAsFile());
    return files;
  } else {
    return Array.from(dt.files);
  }
};

/**
 * Register listeners on the given element to provide drag & drop
 * handling when dropping files onto the given element.
 * @returns A cleanup function that unregisters all listeners on the
 *          given element.
 * @example
 * const off = create(
 *   myDiv,
 *   {
 *     onDrop: files => console.log(files),
 *     onDragOver: el => el.classList.add('dropping'),
 *     onDragLeave: el => el.classList.remove('dropping')
 *   }
 * );
 */
export const create = <T>(
  element: HTMLElement,
  options: Options<T>
): (() => void) => {
  let isOver = false;
  const onDrop: HTMLElement["ondrop"] = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    isOver = false;
    options.onDragLeave?.(element);
    const files = getFilesFromDataTransfer(ev.dataTransfer);
    if (files.length == 0) return;
    if (options.parse) {
      Promise.all(files.map(options.parse))
        .then(options.onDrop)
        .catch(options.onError);
    } else {
      options.onDrop(files as T[]);
    }
  };

  const onDragOver: HTMLElement["ondragover"] = (ev) => {
    ev.preventDefault();
    if (!isOver) {
      isOver = true;
      options.onDragOver?.(element);
    }
  };

  const onDragLeave: HTMLElement["ondragleave"] = (ev) => {
    ev.preventDefault();
    if (isOver) {
      isOver = false;
      options.onDragLeave?.(element);
    }
  };

  element.addEventListener("drop", onDrop);
  element.addEventListener("dragover", onDragOver);
  element.addEventListener("dragleave", onDragLeave);

  return () => {
    options.onDragLeave?.(element);
    element.removeEventListener("drop", onDrop);
    element.removeEventListener("dragover", onDragOver);
    element.removeEventListener("dragleave", onDragLeave);
  };
};
