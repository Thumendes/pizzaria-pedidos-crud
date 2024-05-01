import { ReactNode } from "react";

interface TableFilterProps {
  children: ReactNode;
}

export function TableFilter({ children }: TableFilterProps) {
  return <div>{children}</div>;
}
