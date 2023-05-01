import type { ComponentChild, JSX } from "preact";
import styles from "./preview.module.css";
import { useState } from "preact/hooks";

interface Props<T> {
  files: Map<string, T>;
  onClose: () => void;
}

const Preview = <T,>({ files, onClose }: Props<T>): JSX.Element => {
  const names = [...files.keys()];
  const [active, setActive] = useState(names[0]);
  const current = files.get(active);
  let content: ComponentChild = null;
  if (typeof current == "string") {
    content = <code>{current}</code>;
  } else if (current instanceof File) {
    content = <code>[File, {current.size} bytes]</code>;
  } else if (current instanceof VideoFrame) {
    content = <code>[Image]</code>;
  }
  return (
    <div class={styles.frame}>
      <div class={styles.grid}>
        <div class={styles.tabs}>
          {names.map((name) => (
            <a
              href="#"
              onClick={(ev) => {
                ev.preventDefault();
                setActive(name);
              }}
              class={active == name ? styles.active : null}
            >
              {name}
            </a>
          ))}
        </div>

        <div>{content}</div>
      </div>
      <button class={styles.close} onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default Preview;
