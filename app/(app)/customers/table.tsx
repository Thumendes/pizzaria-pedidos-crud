"use client";

import { alert } from "@/components/alert-dialog";
import { Table, TableAction, TableColumn } from "@/components/table-compose";
import { useFilters } from "@/components/table-compose/hooks/useFilters";
import { usePagination } from "@/components/table-compose/hooks/usePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import { RouterInput, RouterOutput } from "@/server/router";
import { Filter } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

type Filters = RouterInput["customers"]["getAll"];
type CustomersItemResponse = RouterOutput["customers"]["getAll"]["data"][0];

interface CustomersTableProps {}

export function CustomersTable({}: CustomersTableProps) {
  const [, setSearchParams] = useSearchParams();
  const filters = useFilters<Filters["sort"]>();
  const pagination = usePagination();

  const { data, isLoading } = trpc.customers.getAll.useQuery({
    search: filters.search,
    order: filters.order,
    sort: filters.sort,
    page: pagination.currentPage,
    take: pagination.currentLimit,
  });

  const utils = trpc.useUtils();
  const deleteCustomerMutation = trpc.customers.delete.useMutation();

  const tableColumns = useMemo(
    () =>
      [
        {
          id: "name",
          label: "Nome",
          field: "name",
          orderable: true,
        },
        {
          id: "phone",
          label: "Telefone",
          field: "phone",
          orderable: true,
        },
        {
          id: "email",
          label: "E-mail",
          field: "email",
          orderable: true,
        },
        {
          id: "createdAt",
          label: "Criado em",
          render: (item) => formatDate(item.createdAt),
          orderable: true,
        },
      ] as TableColumn<CustomersItemResponse>[],
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
        {
          id: "delete",
          label: "Deletar",
          onClick: async (item) => {
            const confirmed = await alert.confirm(`Deseja deletar o item ${item.name}?`);

            if (!confirmed) {
              return;
            }

            toast.promise(
              async () => {
                await deleteCustomerMutation.mutateAsync({ id: item.id });
                await utils.customers.getAll.invalidate();
              },
              {
                loading: "Deletando cliente...",
                success: "Cliente deletado com sucesso",
                error: (error) => `Erro ao deletar cliente: ${error.message}`,
              }
            );
          },
        },
      ] as TableAction<CustomersItemResponse>[],
    []
  );

  return (
    <Table.Root columns={tableColumns} actions={tableActions} isLoading={isLoading} data={data?.data || []}>
      <Table.Filter>
        <form
          className="flex items-center justify-between space-x-4"
          onSubmit={(event) => {
            event.preventDefault();
            filters.onSearchChange(event.currentTarget.search.value ?? undefined);
          }}
        >
          <Input name="search" placeholder="Pesquisar" />
          <Button type="submit">
            Filtrar
            <Filter className="ml-2" size={16} />
          </Button>
        </form>
      </Table.Filter>

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
