import { FunctionalComponent } from "preact";
import { create, asText, asJSON, Options } from "../../src/index.js";
import { useEffect, useRef, useState } from "preact/hooks";
import styles from "./drop.module.css";
import Preview from "./preview.js";

interface Props {
  animate: boolean;
  parse?: "text" | "json" | "image";
  filePicker: boolean;
}

const Drop: FunctionalComponent<Props> = ({ animate, parse, filePicker }) => {
  const container = useRef<HTMLDivElement>();

  const [files, setFiles] = useState<Map<string, unknown> | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const options: Options<unknown> = {
      onDrop: (files) => setFiles(files),
    };
    if (animate) {
      options.onDragOver = (el) => el.classList.add(styles.over);
      options.onDragLeave = (el) => el.classList.remove(styles.over);
    }
    if (parse == "text") {
      options.parse = asText;
    } else if (parse == "json") {
      options.parse = asJSON;
    }
    if (!filePicker) {
      options.filePicker = { enabled: false };
    }
    return create(container.current, options);
  }, [container.current, animate, parse, filePicker]);

  return (
    <>
      {/* @ts-ignore */}
      <div ref={container} class={styles.drop}>
        <div>Drop files here</div>
      </div>
      {files ? <Preview files={files} onClose={() => setFiles(null)} /> : null}
    </>
  );
};

export default Drop;
