import { ReactNode } from "react";
import { TableBody } from "./components/body";
import { TableContent } from "./components/content";
import { TableFilter } from "./components/filter";
import { TableHead } from "./components/head";
import { TablePagination } from "./components/pagination";
import { TableRoot } from "./components/root";
import { TableSelectable, TableSelectableAction } from "./components/selectable";

export interface TableColumn<T> {
  orderable?: boolean;
  id: string;
  field?: ((row: T) => string | number) | keyof T;
  label: string;
  render?: (row: T) => ReactNode;
}

export interface TableAction<T> {
  id: string;
  label: string;
  disabled?: ((row: T) => boolean) | boolean;
  render?: (row: T) => ReactNode;
  onClick: (row: T) => void;
}

export const Table = {
  Root: TableRoot,
  Content: TableContent,
  Filter: TableFilter,
  Head: TableHead,
  Body: TableBody,
  Pagination: TablePagination,
  Selectable: TableSelectable,
  SelectableAction: TableSelectableAction,
};
