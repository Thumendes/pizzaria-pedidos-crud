"use client";

import { alert } from "@/components/alert-dialog";
import { Table, TableAction, TableColumn } from "@/components/table-compose";
import { useFilters } from "@/components/table-compose/hooks/useFilters";
import { usePagination } from "@/components/table-compose/hooks/usePagination";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { trpc } from "@/lib/trpc/client";
import { formatDate, formatPrice } from "@/lib/utils";
import { RouterInput, RouterOutput } from "@/server/router";
import { OrderStatus } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { z } from "zod";

type Filters = RouterInput["orders"]["getAll"];
type OrdersItemResponse = RouterOutput["orders"]["getAll"]["data"][0];

interface OrdersTableProps {}

export function OrdersTable({}: OrdersTableProps) {
  const [, setSearchParams] = useSearchParams();
  const filters = useFilters<Filters["sort"]>();
  const pagination = usePagination();

  const { data, isLoading, refetch } = trpc.orders.getAll.useQuery({
    order: filters.order,
    sort: filters.sort,
    page: pagination.currentPage,
    take: pagination.currentLimit,
  });

  const updateMutation = trpc.orders.update.useMutation();

  const tableColumns = useMemo(
    () =>
      [
        {
          id: "id",
          label: "ID",
          render: (item) => (
            <Link href={`/orders/${item.id}`}>
              <div className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                {item.id} <ExternalLink className="size-4 ml-2" />
              </div>
            </Link>
          ),
          orderable: true,
        },
        {
          id: "total",
          label: "Total",
          field: "total",
          render: (item) => formatPrice(item.total),
          orderable: true,
        },
        {
          id: "status",
          label: "Status",
          render: (item) => (
            <Badge
              onClick={async () => {
                const newStatus = await alert.form(`Desenha alterar o status do pedido #${item.id}`, {
                  schema: z.object({ status: z.nativeEnum(OrderStatus) }),
                  defaultValues: { status: item.status },
                  form(form) {
                    return (
                      <Select
                        onValueChange={(value) => form.setValue("status", value as OrderStatus)}
                        defaultValue={form.watch("status")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value={OrderStatus.PENDING}>Pendente</SelectItem>
                          <SelectItem value={OrderStatus.CONFIRMED}>Confirmado</SelectItem>
                          <SelectItem value={OrderStatus.CANCELLED}>Cancelado</SelectItem>
                          <SelectItem value={OrderStatus.DELIVERED}>Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                    );
                  },
                });

                if (newStatus) {
                  await updateMutation.mutateAsync({ id: item.id, status: newStatus.status });
                  await refetch();
                }
              }}
            >
              {item.status}
            </Badge>
          ),
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
