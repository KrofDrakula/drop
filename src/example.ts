import { create, asText } from "./index";

const target = document.body.querySelector("#drop_target")! as HTMLDivElement;

create(target, {
  onDrop: (files) => {
    console.log(files);
  },
  onDragOver(element) {
    element.classList.add("over");
  },
  onDragLeave(element) {
    element.classList.remove("over");
  },
  parse: asText,
});
