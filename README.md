# Drop

![Version](https://badgen.net/npm/v/@krofdrakula/drop)
![Types](https://badgen.net/npm/types/@krofdrakula/drop)
![GZip size](https://badgen.net/bundlephobia/minzip/@krofdrakula/drop)
![Dependency count](https://badgen.net/bundlephobia/dependency-count/@krofdrakula/drop)
![Tree shaking](https://badgen.net/bundlephobia/tree-shaking/@krofdrakula/drop)

A small utility to make consuming files dragged into a browser a breeze.

## Usage

Install the package as a direct dependency:

```
npm install @krofdrakula/drop
```

The package provides both CommonJS and ES module versions.

## Options

The `create` function takes the following options:

|               |            |                                                                                                                                                                                                  |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onDrop`      | _required_ | The function that will be called when files are dropped onto the given element. When a `parse` function is provided, the files will be transformed from `File` to whatever the function returns. |
| `onError`     | _optional_ | An optional error handler that will capture errors produced when calling the `parse` function.                                                                                                   |
| `parse`       | _optional_ | Allows transforming files before handing the results to the `onDrop` function.                                                                                                                   |
| `onDragOver`  | _optional_ | Fired when dragging files into the HTML element handling the file drop event.                                                                                                                    |
| `onDragLeave` | _optional_ | Fired when the user drags files off of the HTML element handling the file drop event. It is also triggered just before files are dropped by the user and the `onDrop` handler fires.             |

---

## Examples

### Simple

To use the package, import the `create` function and pass it an element to activate the required handlers:

```ts
import { create } from "@krofdrakula/drop";

const myDiv = document.body.querySelector("#drop_target")!;

const deactivate = create(myDiv, {
  onDrop: (files) => console.log(files),
});
```

This will log out all files dropped onto the `#drop_target` element in the console.

Calling the function returned (`deactivate`) will remove the event handlers and reset the element to its previous state.

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

- `asText` — transforms each file content into a single string
- `asJSON` — parses each file content into its JSON value

You can pass any function that takes a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object and returns any value.

For example, using a library to parse files and return data is relatively straightforward if the library supports working with `File`s directly:

```ts
import { create } from '@krofdrakula/drop';
import Papa from 'papaparse';

const myDiv = document.body.querySelector("#drop_target")!;

create(
  myDiv,
  {
    onDrop: (files) => console.log(files),
    onError: (err) => console.error(err),
    parse: (file) => new Promise(
      (resolve, reject) => Papa.parse(
        file,
        { complete: resolve, error: reject }
      )
    );
);
```
