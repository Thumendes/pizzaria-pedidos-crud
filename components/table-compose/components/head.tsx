import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { TableColumn } from "..";
import { Button } from "../../ui/button";
import { useTableContext } from "./root";
import { Checkbox } from "../../ui/checkbox";
import { TableHead as UiTableHead, TableHeader as UiTableHeader, TableRow as UiTableRow } from "../../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";

interface TableHeadProps {
  onSort?: (column: TableColumn<any>, direction: "asc" | "desc") => void;
}

export function TableHead({ onSort }: TableHeadProps) {
  const { columns, actions, selectable, toggleAll, togglePageItems, selectedItems } = useTableContext();
  const [order, setOrder] = useState<"asc" | "desc" | undefined>();

  return (
    <UiTableHeader>
      <UiTableRow>
        {selectable && (
          <UiTableHead className="p-2 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Checkbox checked={selectedItems === "all"} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={toggleAll}>
                  {selectedItems === "all" ? "Desmarcar todos itens" : "Marcar todos itens"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={togglePageItems}>Inverter marcação de todos da tabela</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </UiTableHead>
        )}

        {columns.map((column) => (
          <UiTableHead key={column.id}>
            <div className="flex justify-between items-center">
              <span>{column.label}</span>

              {column.orderable ? (
                <Button size="sm" variant="ghost">
                  <ArrowUpDown
                    onClick={() => {
                      const newOrder = order === "asc" ? "desc" : "asc";
                      setOrder(newOrder);
                      onSort?.(column, newOrder);
                    }}
                    size={15}
                  />
                </Button>
              ) : null}
            </div>
          </UiTableHead>
        ))}

        {actions ? <UiTableHead className="text-end">Ações</UiTableHead> : null}
      </UiTableRow>
    </UiTableHeader>
  );
}
