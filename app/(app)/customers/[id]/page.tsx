import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApi } from "@/lib/trpc/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { Calendar, ExternalLink, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const api = await createApi();
  const customer = await api.customers.getOne.query({ id: params.id });

  if (!customer) {
    return redirect("/customers");
  }

  const orders = await api.customers.getOrders.query({ id: params.id });

  return (
    <>
      <header className="py-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{customer.name}</h1>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/customers">Clientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{customer.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-semibold mb-2">{customer.name}</h2>
          </div>

          <div className="text-muted-foreground flex items-center gap-2">
            <Phone className="size-4" />
            <p>{customer.phone}</p>
          </div>

          <div className="text-muted-foreground flex items-center gap-2">
            <Mail className="size-4" />
            <p>{customer.email}</p>
          </div>
        </div>

        <div className="sm:text-end">
          <p className="text-sm">Criado em</p>
          <div className="text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4" />
            <p>{formatDate(customer.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div className="shadow-md border rounded-md p-4 space-y-2" key={order.id}>
            <div className="flex justify-between">
              <p className="text-lg font-semibold truncate">Pedido {order.id}</p>
              <Badge>{order.status}</Badge>
            </div>

            <div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="size-4" />
                <p>{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <p className="text-2xl font-semibold">{formatPrice(order.total)}</p>

              <Link href={`/orders/${order.id}`}>
                <div className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                  Ver detalhes <ExternalLink className="size-4 ml-2" />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
