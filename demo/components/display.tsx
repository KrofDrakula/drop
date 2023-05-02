import { FunctionalComponent } from "preact";
import styles from "./display.module.css";
import Code from "./code.js";
import { useCallback, useState } from "preact/hooks";
import Drop from "./drop.js";

const getCode = (animate: boolean, parse?: "text" | "json") => {
  const imports = ["create"];

  let blocks = "";

  if (animate) {
    blocks += `  onDragOver: (el) => el.classList.add('over'),
  onDragLeave: (el) => el.classList.remove('over'),\n`;
  }
  if (parse == "text") {
    imports.push("asText");
    blocks += `  parse: asText,\n`;
  } else if (parse == "json") {
    imports.push("asJSON");
    blocks += `  parse: asJSON,\n`;
  }

  return `import { ${imports.join(", ")} } from '@krofdrakula/drop';

const container = document.getElementById('drop-target')!;

create(container, {
  onDrop: (files) => console.log(files),
${blocks}});
`;
};

const Display: FunctionalComponent = () => {
  const [animate, setAnimate] = useState(true);
  const [parse, setParse] = useState(undefined);

  const handleRadio = useCallback(
    (ev: Parameters<HTMLInputElement["oninput"]>[0]) => {
      const value = (ev.target as HTMLInputElement).value;
      setParse(value ? value : undefined);
    },
    []
  );

  return (
    <div class={styles.grid}>
      <div class={styles.sidebar}>
        <h3>Options</h3>
        <div>
          <label>
            <input
              type="checkbox"
              onInput={(ev) =>
                setAnimate((ev.target as HTMLInputElement).checked)
              }
              checked={animate}
            />{" "}
            Animate while dragging files over element
          </label>
        </div>
        <div>
          Parse files as:
          <ul>
            <li>
              <label>
                <input
                  type="radio"
                  name="parse"
                  value=""
                  checked={!parse}
                  onInput={handleRadio}
                />{" "}
                Raw
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="parse"
                  value="text"
                  checked={parse == "text"}
                  onInput={handleRadio}
                />{" "}
                Text
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="parse"
                  value="json"
                  checked={parse == "json"}
                  onInput={handleRadio}
                />{" "}
                JSON
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class={styles.live}>
        <Drop animate={animate} parse={parse} />
      </div>
      <div class={styles.code}>
        <Code>{getCode(animate, parse)}</Code>
      </div>
    </div>
  );
};

export default Display;
