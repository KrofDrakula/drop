export interface FilePickerOptions {
  /**
   * Enables invoking the file picker when clicking the element.
   * Defaults to `true`.
   */
  enabled?: boolean;
  /**
   * A boolean value that defaults to `false`. When set to `true`
   * multiple files may be selected.
   * */
  multiple?: boolean;
  /**
   * A boolean value that defaults to `false`. By default the
   * picker should include an option to not apply any file type
   * filters (instigated with the `types` option). Setting this
   * option to `true` means that option is not available.
   */
  excludeAllOption?: boolean;
  /**
   * An array of allowed file types to pick.
   */
  types?: {
    /**
     * An object with the keys set to the MIME type and the values
     * an array of file extensions.
     * @example
     * accept: {
     *   "image/*": [".png", ".jpg", ".jpeg", ".gif"]
     * }
     */
    accept: { [mimeType: string]: string[] };
    /**
     * An optional description of the category of files types allowed.
     */
    description?: string;
  }[];
}

export interface Options<T> {
  /**
   * The function that will be called when files are dropped
   * onto the given element. When a `parse` function is provided,
   * the files will be transformed from `File` to whatever the
   * function returns.
   */
  onDrop: (files: Map<string, T>) => void;
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
  /**
   * Fires when the pointer is over the hit box of the element while
   * not dragging any files.
   */
  onEmptyEnter?: (element: HTMLElement) => void;
  /**
   * Fires when the pointer leaves the hit box of the element while
   * not dragging any files.
   */
  onEmptyLeave?: (element: HTMLElement) => void;
  /**
   * Configures the options for the file picker. When this option
   * is not given, it will open a file picker with default options.
   */
  filePicker?: FilePickerOptions;
}

const getFilesFromDataTransfer = (dt: DataTransfer): File[] => {
  if (dt.items) {
    const files: File[] = [];
    for (const item of Array.from(dt.items))
      if (item.kind == "file") {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
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
  let isDraggingOver = false;

  const processFiles = (files: File[]) => {
    if (files.length == 0) return;
    if (options.parse) {
      Promise.all(files.map(options.parse))
        .then((transformed) => {
          options.onDrop(
            new Map(transformed.map((t, idx) => [files[idx].name, t]))
          );
        })
        .catch(options.onError);
    } else {
      options.onDrop(new Map(files.map((f) => [f.name, f as T])));
    }
  };

  const onDrop: HTMLElement["ondrop"] = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    isDraggingOver = false;
    options.onDragLeave?.(element);
    if (ev.dataTransfer) {
      const files = getFilesFromDataTransfer(ev.dataTransfer);
      processFiles(files);
    }
  };

  const onDragOver: HTMLElement["ondragover"] = (ev) => {
    ev.preventDefault();
    if (!isDraggingOver) {
      isDraggingOver = true;
      options.onDragOver?.(element);
    }
  };

  const onDragLeave: HTMLElement["ondragleave"] = (ev) => {
    ev.preventDefault();
    if (isDraggingOver) {
      isDraggingOver = false;
      options.onDragLeave?.(element);
    }
  };

  const onEmptyEnter: HTMLElement["onpointerenter"] = () => {
    if (!isDraggingOver) {
      options.onEmptyEnter?.(element);
    }
  };

  const onEmptyLeave: HTMLElement["onpointerleave"] = () => {
    if (!isDraggingOver) {
      options.onEmptyLeave?.(element);
    }
  };

  const onClick: HTMLElement["onclick"] = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    showOpenFilePicker(options.filePicker).then((files) => {
      Promise.all(files.map((handle) => handle.getFile()))
        .then(processFiles)
        .catch(options.onError);
    });
  };

  element.addEventListener("drop", onDrop);
  element.addEventListener("dragover", onDragOver);
  element.addEventListener("dragleave", onDragLeave);
  if (options.filePicker?.enabled ?? true) {
    element.addEventListener("click", onClick);
    element.addEventListener("pointerenter", onEmptyEnter);
    element.addEventListener("pointerleave", onEmptyLeave);
  }

  return () => {
    options.onDragLeave?.(element);
    element.removeEventListener("drop", onDrop);
    element.removeEventListener("dragover", onDragOver);
    element.removeEventListener("dragleave", onDragLeave);
    element.removeEventListener("click", onClick);
    element.removeEventListener("pointerleave", onEmptyLeave);
    element.removeEventListener("pointerenter", onEmptyEnter);
  };
};
