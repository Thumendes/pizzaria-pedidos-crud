import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createApi } from "@/lib/trpc/api";
import { OrdersTable } from "./table";

export default async function OrdersPage({ searchParams }: { searchParams: { editing?: string } }) {
  const api = await createApi();
  const order = await api.orders.getOne.query({ id: searchParams.editing ?? "" });

  return (
    <>
      <header className="py-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Pedidos</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Pedidos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <OrdersTable />

      <pre>{JSON.stringify(order, null, 2)}</pre>
    </>
  );
}
