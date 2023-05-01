import type { FunctionalComponent } from "preact";
import styles from "./layout.module.css";

const Layout: FunctionalComponent = ({ children }) => (
  <div class={styles.layout}>{children}</div>
);

export default Layout;
