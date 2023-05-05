import type { FunctionalComponent } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

Prism.manual = true;

interface Props {
  language?: string;
  children: string;
}

const Code: FunctionalComponent<Props> = ({
  language = "typescript",
  children,
}) => {
  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = children;
    Prism.highlightElement(ref.current);
  });

  const ref = useRef<HTMLPreElement>();

  return (
    <pre style="border-radius: 8px">
      {/* @ts-ignore */}
      <code ref={ref} class={`language-${language}`}>
        {children}
      </code>
    </pre>
  );
};

export default Code;
