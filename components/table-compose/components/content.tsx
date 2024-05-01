import { ReactNode } from "react";
import { Table } from "../../ui/table";

interface TableContentProps {
  children: ReactNode;
}

export function TableContent({ children }: TableContentProps) {
  return (
    <div className="rounded-md border">
      <Table className="table-auto w-full px-4">{children}</Table>
    </div>
  );
}
