import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { useDebounceCallback } from "usehooks-ts";
import { TableColumn } from "..";
import { ChangeEvent } from "react";

type Order = "asc" | "desc";

export function useFilters<SortOptions>() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? undefined;
  const order = (searchParams.get("order") as Order) ?? undefined;
  const sort = (searchParams.get("sort") as SortOptions) ?? undefined;

  function onSortChange(column: TableColumn<SortOptions>, order: Order) {
    setSearchParams((state) => {
      state.set("sort", String(column.id));
      state.set("order", String(order));
    });
  }

  function handleChangeSearch(value: string | ChangeEvent<HTMLInputElement>) {
    const newValue = typeof value === "string" ? value : value.target.value;
    setSearchParams((state) => state.set("search", newValue));
  }

  const onSearchChange = useDebounceCallback(handleChangeSearch, 500);

  return {
    search,
    order,
    sort,
    onSortChange,
    onSearchChange,
  };
}
