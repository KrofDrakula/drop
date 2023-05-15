import { create } from "../src/index.js";

const dropTarget = document.getElementById("drop-target")!;
const preview = document.getElementById("preview")!;

const readline = async function* (
  readable: ReadableStream<string>
): AsyncGenerator<string> {
  const reader = readable.getReader();
  try {
    let previous = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      const lines = value.split(/\r?\n/);
      if (lines.length > 1) {
        yield previous + lines[0];
        previous = "";
      }
      for (let i = 1; i < lines.length - 1; i++) {
        yield lines[i];
      }
      previous = lines.at(-1)!;
    }
  } finally {
    reader.releaseLock();
  }
};

create(dropTarget, {
  onDrop: async (files) => {
    const frag = document.createDocumentFragment();
    for (const [name, lines] of files) {
      const title = document.createElement("h1");
      title.textContent = name;
      const list = document.createElement("ol");
      frag.append(title, list);
      for await (const line of lines) {
        const li = document.createElement("li");
        li.textContent = line;
        list.append(li);
      }
    }
    preview.replaceChildren(frag);
  },
  parse: (file: File) =>
    readline(file.stream().pipeThrough(new TextDecoderStream())),
});
