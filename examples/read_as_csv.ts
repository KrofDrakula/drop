/*

Note that this library doesn't contain parsers for CSV files
since parsing files is wholly outside of the scope. In this example,
`papaparse` is used as the CSV library as an example of how
to write a `parse` function that needs to deal with an async or
callback-based value.

*/

import { create } from "@krofdrakula/drop";
// @ts-ignore
import Papa from "papaparse";

const myDiv = document.getElementById("drop-target")!;

create(myDiv, {
  onDrop: (files) => console.log(files),
  onError: (err) => console.error(err),
  parse: (file) =>
    new Promise((resolve, reject) =>
      Papa.parse(file, { complete: resolve, error: reject })
    ),
});
