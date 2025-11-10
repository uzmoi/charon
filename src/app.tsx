import { useState } from "preact/hooks";
import { actions } from "./actions";
import { Charon } from "./core";
import { CharonCanvas } from "./ui/canvas";
import styles from "./app.module.scss";

export const App: preact.FunctionComponent = () => {
  const [charon] = useState(() => new Charon({ types: [], actions }));

  return (
    <div id={styles.root}>
      <header>
        <h1>Charon</h1>
      </header>
      <CharonCanvas charon={charon} />
    </div>
  );
};
