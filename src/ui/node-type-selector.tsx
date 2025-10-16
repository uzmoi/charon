import { PlusIcon } from "lucide-preact";
import { useId } from "preact/hooks";

export const NodeTypeSelector: preact.FunctionComponent<{
  types: readonly string[];
  selectType: (type: string) => void;
}> = ({ types, selectType }) => {
  const id = useId();

  return (
    <div>
      <button popoverTarget={id}>
        <PlusIcon size={14} /> Add Node
      </button>
      <div popover id={id}>
        {types.map(type => (
          <button key={type} value={type} onClick={selectType.bind(null, type)}>
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};
