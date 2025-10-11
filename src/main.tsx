import { render } from "preact";
import "./global.scss";
import { App } from "./app";

render(<App />, document.getElementById("app")!);
