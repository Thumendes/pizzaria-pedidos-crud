import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { OrdersForm } from "./form";
import { OrdersTable } from "./table";

export default async function OrdersPage() {
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

        <div>
          <OrdersForm />
        </div>
      </header>

      <OrdersTable />
    </>
  );
}
