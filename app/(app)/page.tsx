import { CustomerCountStat } from "@/components/charts/customers";
import { MenuCountStat } from "@/components/charts/menu";
import { MostRequestMenuItemTable } from "@/components/charts/mostRequested";
import { OrderCountStat } from "@/components/charts/orders";
import { Skeleton } from "@/components/ui/skeleton";

import { Suspense } from "react";

export default function Home() {
  return (
    <main className="space-y-6">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Suspense
          fallback={<Skeleton className="flex items-center justify-center py-4">Carregando pedidos...</Skeleton>}
        >
          <OrderCountStat />
        </Suspense>

        <Suspense
          fallback={<Skeleton className="flex items-center justify-center py-4">Carregando clientes...</Skeleton>}
        >
          <CustomerCountStat />
        </Suspense>

        <Suspense fallback={<Skeleton className="flex items-center justify-center py-4">Carregando menu...</Skeleton>}>
          <MenuCountStat />
        </Suspense>
      </div>

      <div>
        <header className="py-4">
          <h3 className="text-xl font-semibold">Items mais pedidos do menu</h3>
        </header>

        <Suspense
          fallback={<Skeleton className="flex items-center justify-center py-4">Carregando tabela...</Skeleton>}
        >
          <MostRequestMenuItemTable />
        </Suspense>
      </div>
    </main>
  );
}
