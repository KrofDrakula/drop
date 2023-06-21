# `@krofdrakula/drop`

![Bryan Cranston dropping a mic](https://media.giphy.com/media/3o72Fk2eBOXRDhoq9W/giphy.gif)

A small utility to make consuming files dragged into a browser a breeze.

![Version](https://badgen.net/npm/v/@krofdrakula/drop)
![Types](https://badgen.net/npm/types/@krofdrakula/drop)
![GZip size](https://img.shields.io/bundlephobia/minzip/%40krofdrakula%2Fdrop)

[Changelog](CHANGELOG.md)

## TL;DR

```ts
import { create } from "@krofdrakula/drop";
create(document.getElementById("drop_target"), {
  onDrop: (files) => console.log(files),
});
```

## Usage

Install the package as a direct dependency:

```
npm install @krofdrakula/drop
```

The package provides both CommonJS and ES module versions.

## Options

The `create` function takes the following options:

| Parameter       |            | Description                                                                                                                                                                                                                                                                                                 |
| --------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onDrop`        | _required_ | The function that will be called when files are dropped onto the given element. When a `parse` function is provided, the files will be transformed from `File` to whatever the function returns.                                                                                                            |
| `onError`       | _optional_ | An optional error handler that will capture errors produced when calling the `parse` function.                                                                                                                                                                                                              |
| `parse`         | _optional_ | Allows transforming files before handing the results to the `onDrop` function.                                                                                                                                                                                                                              |
| `onDragOver`    | _optional_ | Fired when dragging files into the HTML element handling the file drop event.                                                                                                                                                                                                                               |
| `onDragLeave`   | _optional_ | Fired when the user drags files off of the HTML element handling the file drop event. It is also triggered just before files are dropped by the user and the `onDrop` handler fires.                                                                                                                        |
| `filePicker`    | _optional_ | Used to configure the file picker shown when the element is clicked. It is enabled by default but can be disabled by providing `{ enabled: false }`. Other options are passed through to the [`showOpenFilePicker()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker) function. |
| `onEmptyEnter`  | _optional_ | If the file picker is enabled, this handler fires when the pointer enter the hit box of the element without dragging files.                                                                                                                                                                                 |
| `onEmptyLeave`  | _optional_ | If the file picker is enabled, this handler fires when the pointer leaves the hit box of the element without dragging files.                                                                                                                                                                                |

---

## Examples

- [Read raw files](examples/simple.ts)
- [Read files as text](examples/read_as_text.ts)
- [Read files as JSON](examples/read_as_json.ts)
- [Read files as CSV](examples/read_as_csv.ts)
- [Use in React-like libraries](examples/preact_example.tsx)
- [Render images to HTML](examples/display_image.ts)
- [Draw images to canvas](examples/draw_image_on_canvas.ts)
- [Read a file line-by-line](examples/read_file_line_by_line.ts)

### Styling the element

`create` options let you hook into events that trigger when files are dragged over or dragged outside of the given element.

For example, you can add or remove a class name when files are over a drop target:

```ts
create(myDiv, {
  onDrop: () => {},
  onDragOver: (element) => element.classList.add("over"),
  onDragLeave: (element) => element.classList.remove("over"),
});
```

To indicate that the element can also be clicked, you can also add handlers that will enable you to signal that affordance:

```ts
create(myDiv, {
  onDrop: () => {},
  onEmptyEnter: (element) => element.classList.add("hover"),
  onEmptyLeave: (element) => element.classList.remove("hover"),
});
```

Note that these are distinct from the default `hover` event because these handlers will only trigger when the file picker is enabled and the pointer is not dragging any files.

### Transforming files

By default, all of the files will be passed through as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) objects. If you expect files to be have a particular type of content, you can provide a `parse` function that will transform the contents into a more convenient form:

```ts
import { create, asJSON } from "@krofdrakula/drop";

const myDiv = document.body.querySelector("#drop_target")!;

create(myDiv, {
  onDrop: (files) => console.log(files),
  onError: (err) => console.error(err),
  parse: asJSON,
});
```

If any file provided triggers a parsing errors, the `onDrop` handler will not be called and will instead call the `onError` handler with the error raised.

This package currently provides two helper functions to parse files:

- [`asText`](src/parsers.ts) — transforms each file content into a single string
- [`asJSON`](src/parsers.ts) — parses each file content into its JSON value

You can pass any function that takes a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object and returns any value. Refer to the examples above to see how to integrate with a parsing utility.
