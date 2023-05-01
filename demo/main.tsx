import { render } from "preact";
import Layout from "./components/layout.js";
import Display from "./components/display.js";

const root = document.getElementById("root")! as HTMLDivElement;

render(
  <Layout>
    <h1>@krofdrakula/drop</h1>
    <Display />
  </Layout>,
  root
);
