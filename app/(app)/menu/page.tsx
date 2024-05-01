import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { MenuTable } from "./table";
import { createApi } from "@/lib/trpc/api";
import { MenuItemsForm } from "./form";

export default async function MenuPage({ searchParams }: { searchParams: { editing?: string } }) {
  const api = await createApi();
  const menu = await api.menu.getOneItem.query({ id: searchParams.editing ?? "" });

  return (
    <>
      <header className="py-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Items do Menu</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Items do Menu</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <MenuItemsForm editing={menu} />
        </div>
      </header>

      <MenuTable />
    </>
  );
}
