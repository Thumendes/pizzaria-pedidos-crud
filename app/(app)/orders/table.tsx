"use client";

import { Table, TableAction, TableColumn } from "@/components/table-compose";
import { useFilters } from "@/components/table-compose/hooks/useFilters";
import { usePagination } from "@/components/table-compose/hooks/usePagination";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import { RouterInput, RouterOutput } from "@/server/router";
import { useMemo } from "react";

type Filters = RouterInput["orders"]["getAll"];
type OrdersItemResponse = RouterOutput["orders"]["getAll"]["data"][0];

interface OrdersTableProps {}

export function OrdersTable({}: OrdersTableProps) {
  const [, setSearchParams] = useSearchParams();
  const filters = useFilters<Filters["sort"]>();
  const pagination = usePagination();

  const { data, isLoading } = trpc.orders.getAll.useQuery({
    order: filters.order,
    sort: filters.sort,
    page: pagination.currentPage,
    take: pagination.currentLimit,
  });

  const tableColumns = useMemo(
    () =>
      [
        {
          id: "id",
          label: "ID",
          field: "id",
          orderable: true,
        },
        {
          id: "status",
          label: "Status",
          render: (item) => <Badge>{item.status}</Badge>,
          orderable: true,
        },
        {
          id: "createdAt",
          label: "Criado em",
          render: (item) => formatDate(item.createdAt),
          orderable: true,
        },
      ] as TableColumn<OrdersItemResponse>[],
    []
  );

  const tableActions = useMemo(
    () =>
      [
        {
          id: "edit",
          label: "Editar",
          onClick: (item) => {
            setSearchParams((params) => params.set("editing", item.id));
          },
        },
      ] as TableAction<OrdersItemResponse>[],
    []
  );

  return (
    <Table.Root
      columns={tableColumns}
      // actions={tableActions}
      isLoading={isLoading}
      data={data?.data || []}
      keyExtractor="id"
    >
      <Table.Content>
        <Table.Head onSort={(column, direction) => filters.onSortChange(column, direction)} />
        <Table.Body />
      </Table.Content>

      <Table.Pagination
        page={data?.meta.currentPage}
        totalPages={data?.meta.pageCount}
        limit={data?.meta.limit}
        limitOptions={[5, 10, 15, 20]}
        onLimitChange={pagination.onLimitChange}
        onPageChange={pagination.onPageChange}
      />
    </Table.Root>
  );
}
