import { create } from "@krofdrakula/drop";

const dropTarget = document.getElementById("drop-target")!;

create(dropTarget, {
  // will print out `Map<string, File>`
  onDrop: (files) => console.log(files),
});
