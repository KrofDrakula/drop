import type { ComponentChild, JSX } from "preact";
import styles from "./preview.module.css";
import { useEffect, useState } from "preact/hooks";
import Code from "./code.js";

interface Props<T> {
  files: Map<string, T>;
  onClose: () => void;
}

const Preview = <T,>({ files, onClose }: Props<T>): JSX.Element => {
  const names = [...files.keys()];
  const [active, setActive] = useState(names[0]);
  const current = files.get(active);

  const [content, setContent] = useState<ComponentChild | null>(null);

  useEffect(() => {
    if (current instanceof File) {
      if (current.type.startsWith("image/")) {
        const url = URL.createObjectURL(current);
        setContent(<img src={url} />);
      } else if (current.type.startsWith("video/")) {
        const url = URL.createObjectURL(current);
        setContent(
          <video
            src={url}
            autoPlay={true}
            muted={true}
            controls={true}
            loop={true}
          />
        );
      } else if (current.type.startsWith("text/") && current.size < 2e5) {
        current.text().then((str) => setContent(<code>{str}</code>));
      } else {
        setContent(
          <code>
            [File {current.type}, {current.size} bytes]
          </code>
        );
      }
    } else if (typeof current == "string") {
      setContent(<code>{current}</code>);
    } else {
      setContent(
        <Code language="json">{JSON.stringify(current, null, 2)}</Code>
      );
    }
  }, [current]);

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

        <div class={styles.content}>{content}</div>
      </div>
      <button class={styles.close} onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default Preview;
