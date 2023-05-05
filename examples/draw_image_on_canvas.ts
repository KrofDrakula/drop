import { create } from "@krofdrakula/drop";

const dropTarget = document.getElementById("drop-target")!;
const canvas = document.getElementById("preview")! as HTMLCanvasElement;

// we need to keep a record of previous URLs generated to clear
// memory when not needed anymore
let currentURL: string | null = null;

const drawImage = (src: string) => {
  // we revoke the previous image's URL to avoid leaking memory
  if (currentURL) URL.revokeObjectURL(currentURL);
  currentURL = src;
  const image = new Image();
  // wait for the image to load before drawing
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0);
  };
  // start loading the image
  image.src = src;
};

create(dropTarget, {
  onDrop: (files) => {
    // get the first file that is an image type
    const image = [...files.values()].find((file) =>
      file.type.startsWith("image/")
    );
    // if found, draw it to the canvas
    if (image) drawImage(URL.createObjectURL(image));
  },
});
