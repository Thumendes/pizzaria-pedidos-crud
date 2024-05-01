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

type Filters = RouterInput["menu"]["getItems"];
type MenuItemResponse = RouterOutput["menu"]["getItems"]["data"][0];

interface MenuTableProps {}

export function MenuTable({}: MenuTableProps) {
  const [, setSearchParams] = useSearchParams();
  const filters = useFilters<Filters["sort"]>();
  const pagination = usePagination();

  const { data, isLoading } = trpc.menu.getItems.useQuery({
    search: filters.search,
    order: filters.order,
    sort: filters.sort,
    page: pagination.currentPage,
    take: pagination.currentLimit,
  });

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
          id: "categoryId",
          label: "Categoria",
          render: (item) => item.category.name,
          orderable: true,
        },
        {
          id: "createdAt",
          label: "Criado em",
          render: (item) => formatDate(item.createdAt),
          orderable: true,
        },
      ] as TableColumn<MenuItemResponse>[],
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
          },
        },
      ] as TableAction<MenuItemResponse>[],
    []
  );
  return (
    <Table.Root
      columns={tableColumns}
      actions={tableActions}
      isLoading={isLoading}
      data={data?.data || []}
      keyExtractor="id"
    >
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
