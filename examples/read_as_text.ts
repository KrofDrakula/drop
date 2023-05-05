import { create, asText } from "@krofdrakula/drop";

const dropTarget = document.getElementById("drop-target")!;

create(dropTarget, {
  onDrop: (files) => console.log(files),
  parse: asText,
});
