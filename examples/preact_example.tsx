import type { FunctionalComponent } from "preact";
import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import { create } from "@krofdrakula/drop";

interface PreviewProps {
  sources: string[];
}

const Preview: FunctionalComponent<PreviewProps> = ({ sources }) => {
  return (
    <ul>
      {sources.map((src) => (
        <li>
          <img src={src} />
        </li>
      ))}
    </ul>
  );
};

interface DropTargetProps {
  onDrop: (files: Map<string, File>) => void;
}

// this component provides the drop target for files
const DropTarget: FunctionalComponent<DropTargetProps> = ({ onDrop }) => {
  const dropTarget = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!dropTarget.current) return;
    return create(dropTarget.current, { onDrop });
  }, [dropTarget.current, onDrop]);
  // @ts-ignore refs have incompatible null/undefined types here
  return <div ref={dropTarget}>Drop files here</div>;
};

const Demo = () => {
  const [sources, setSources] = useState<string[]>([]);

  const onDrop = useCallback(
    (files: Map<string, File>) => {
      setSources((currentSources) => {
        // release all current object URLs to free memory
        for (const url of currentSources) URL.revokeObjectURL(url);
        // set the new URLs
        return [...files.values()].map((file) => URL.createObjectURL(file));
      });
    },
    [setSources]
  );

  return (
    <>
      <DropTarget onDrop={onDrop} />
      <Preview sources={sources} />
    </>
  );
};

export default Demo;
