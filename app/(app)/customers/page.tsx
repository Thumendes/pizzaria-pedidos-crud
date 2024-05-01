import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createApi } from "@/lib/trpc/api";
import { CustomersForm } from "./form";
import { CustomersTable } from "./table";

export default async function CustomersPage({ searchParams }: { searchParams: { editing?: string } }) {
  const api = await createApi();
  const customer = searchParams.editing ? await api.customers.getOne.query({ id: searchParams.editing }) : null;

  return (
    <>
      <header className="py-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Clientes</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Clientes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <CustomersForm editing={customer} />
        </div>
      </header>

      <CustomersTable />
    </>
  );
}
