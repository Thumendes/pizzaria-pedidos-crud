import { ReactNode, useMemo } from "react";
import { useTableContext } from "./root";
import { Button, ButtonProps } from "../../ui/button";

interface TableSelectableProps {
  children?: ReactNode;
  totalItems: number;
}

export function TableSelectable({ children, totalItems }: TableSelectableProps) {
  const { selectedItems } = useTableContext();

  const selectedItemsCount = selectedItems === "all" ? Infinity : Object.keys(selectedItems).length;

  if (selectedItemsCount < 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {selectedItemsCount === Infinity
            ? "Todos itens selecionados"
            : `${selectedItemsCount} de ${totalItems} selectionado(s)`}
        </span>
      </div>

      <ul className="flex items-center space-x-3">{children}</ul>
    </div>
  );
}

interface TableSelectableActionProps extends ButtonProps {
  children?: ReactNode;
  isDisabled?<T>(selectedItems: T[] | "all", clearSelectedItems: () => void): boolean;
  onAction<T>(selectedItems: T[] | "all", clearSelectedItems: () => void): void;
}

export function TableSelectableAction({ onAction, isDisabled, ...props }: TableSelectableActionProps) {
  const { selectedItems, clearSelection } = useTableContext();

  const itemsArray = useMemo(() => {
    return selectedItems === "all" ? "all" : Object.values(selectedItems);
  }, [selectedItems]);

  if (isDisabled) {
    const disabled = isDisabled(itemsArray, () => clearSelection());

    if (disabled) return null;
  }

  return <Button variant="outline" onClick={() => onAction(itemsArray, () => clearSelection())} {...props} />;
}
