import { Children, ReactNode, createContext, isValidElement, useCallback, useContext, useState } from "react";
import { TableAction, TableColumn } from "..";
import { TableSelectable } from "./selectable";

interface TableRootProps<T> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  data: T[];
  keyExtractor?: ((row: T) => string | number) | keyof T;
  isLoading?: boolean;
  children: ReactNode;
}

export interface TableContextValue {
  columns: TableColumn<any>[];
  selectable: boolean;
  actions?: TableAction<any>[];
  selectedItems: Record<string, any> | "all";
  data: any[];
  toggleAll(): void;
  toggleItem(id: string, value: any): void;
  isItemSelected(id: string): boolean;
  togglePageItems(): void;
  clearSelection(): void;
  getItemKey(item: any, index?: number): string;
  isLoading?: boolean;
}

const TableContext = createContext({} as TableContextValue);

export function useTableContext() {
  return useContext(TableContext);
}

export function TableRoot<T>({ isLoading, children, columns, actions, data, keyExtractor }: TableRootProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Record<string, T> | "all">({});

  const selectable = Children.toArray(children).find((child) => {
    return isValidElement(child) && child.type === TableSelectable;
  });

  const getItemKey = useCallback(
    (item: T, index?: number) => {
      if (!keyExtractor) return String(index);

      const itemKey = typeof keyExtractor === "function" ? keyExtractor(item) : item[keyExtractor];

      return String(itemKey);
    },
    [keyExtractor]
  );

  const clearSelection = useCallback(() => {
    setSelectedItems({});
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedItems((prev) => (prev === "all" ? {} : "all"));
  }, []);

  const toggleItem = useCallback((id: string, value: T) => {
    setSelectedItems((prev) => {
      if (prev === "all") {
        return { [id]: value };
      }

      if (prev[id]) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [id]: value };
    });
  }, []);

  const togglePageItems = useCallback(() => {
    for (const [index, item] of data.entries()) {
      const itemKey = getItemKey(item, index);

      toggleItem(itemKey, item);
    }
  }, [data, getItemKey, toggleItem]);

  const isItemSelected = useCallback(
    (id: string) => {
      if (selectedItems === "all") {
        return true;
      }

      return !!selectedItems[id];
    },
    [selectedItems]
  );

  return (
    <TableContext.Provider
      value={{
        columns,
        actions,
        selectedItems,
        data,
        selectable: !!selectable,
        toggleAll,
        toggleItem,
        togglePageItems,
        isItemSelected,
        clearSelection,
        isLoading,
        getItemKey,
      }}
    >
      <div className="w-full flex flex-col space-y-4">{children}</div>
    </TableContext.Provider>
  );
}
