import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Key, ReactNode } from "react";
import { Checkbox } from "../../ui/checkbox";
import { Skeleton } from "../../ui/skeleton";
import { TableBody as UiTableBody, TableCell as UiTableCell, TableRow as UiTableRow } from "../../ui/table";
import { useTableContext } from "../components/root";

interface TableBodyProps<T> {
  onRowClick?: (row: T) => void;
}

export function TableBody<T>({ onRowClick }: TableBodyProps<T>) {
  const { data, getItemKey, columns, actions, selectable, isItemSelected, toggleItem, isLoading } = useTableContext();

  const totalColumns = columns.filter(Boolean).length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  return (
    <UiTableBody>
      {isLoading || !data.length ? (
        <UiTableRow>
          <UiTableCell colSpan={totalColumns} className="text-center p-6 text-lg">
            {isLoading ? (
              <Skeleton className="h-16 w-full flex items-center justify-center">Carregando...</Skeleton>
            ) : data.length === 0 ? (
              <span className="text-sm text-muted-foreground">Nenhum registro encontrado</span>
            ) : null}
          </UiTableCell>
        </UiTableRow>
      ) : (
        data.map((item, index) => {
          const itemKey = getItemKey(item, index);
          const isSelected = isItemSelected(itemKey);

          return (
            <UiTableRow key={itemKey as Key} data-state={isSelected && "selected"} onClick={() => onRowClick?.(item)}>
              {selectable && (
                <UiTableCell className="p-2 px-4">
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleItem(String(itemKey), item)} />
                </UiTableCell>
              )}

              {columns.filter(Boolean).map((column) => {
                const columnKey = `${column.id}-${index}`;
                const value = column.render ? column.render(item) : item[column.field as keyof T];

                return (
                  <UiTableCell className="p-2 px-4" key={columnKey}>
                    {value as ReactNode}
                  </UiTableCell>
                );
              })}

              {actions ? (
                <UiTableCell className="p-2 px-4 text-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical size={15} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      {actions.filter(Boolean).map((action) => {
                        const isDisabled =
                          typeof action.disabled === "function" ? action.disabled(item) : action.disabled;
                        return (
                          <DropdownMenuItem disabled={isDisabled} key={action.id} onClick={() => action.onClick(item)}>
                            {action.render ? action.render(item) : action.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </UiTableCell>
              ) : null}
            </UiTableRow>
          );
        })
      )}
    </UiTableBody>
  );
}
