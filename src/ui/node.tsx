import { memo } from "preact/compat";
import type { Node } from "./types";
import styles from "./node.module.scss";
import { GripVerticalIcon } from "lucide-preact";

export const CharonNode: preact.FunctionComponent<{
  node: Node;
}> = memo(({ node }) => {
  return (
    <div
      class={styles.node}
      style={{
        translate: `${node.pos.x}rem ${node.pos.y}rem`,
        width: `${node.size.width}rem`,
        height: `${node.size.height}rem`,
      }}
    >
      <div class={styles.header}>
        <p class={styles.title}>{node.title}</p>
        <div class={styles.handle} data-id={node.id}>
          <GripVerticalIcon size="1.75rem" class={styles.handle_icon} />
        </div>
      </div>
      <div class={styles.body}></div>
    </div>
  );
});

CharonNode.displayName = "CharonNode";
