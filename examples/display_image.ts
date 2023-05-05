import { create } from "@krofdrakula/drop";

const dropTarget = document.getElementById("drop-target")!;
const preview = document.getElementById("preview")!;

// this populates the `#preview` element with images when they
// are dropped onto the `#drop-target` element
const showImage = (sources: string[]) => {
  const frag = document.createDocumentFragment();
  for (const src of sources) {
    const img = document.createElement("img");
    img.src = src;
    frag.append(img);
  }
  preview.replaceChildren(frag);
};

create<string>(dropTarget, {
  onDrop: (files) => showImage([...files.values()]),
  parse: (file) => URL.createObjectURL(file),
});
