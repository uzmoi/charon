import styles from "./app.module.scss";
import { CharonCanvas } from "./ui/canvas";

export const App: preact.FunctionComponent = () => {
  return (
    <div id={styles.root}>
      <header>
        <h1>Charon</h1>
      </header>
      <CharonCanvas />
    </div>
  );
};
