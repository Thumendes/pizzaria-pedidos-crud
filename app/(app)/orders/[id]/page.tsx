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
import { Calendar, ExternalLink, Phone } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const api = await createApi();
  const order = await api.orders.getOne.query({ id: params.id });

  if (!order) {
    return redirect("/orders");
  }

  return (
    <>
      <header className="py-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            Pedido <span className="text-muted-foreground font-mono">{order.id}</span>
          </h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/orders">Pedidos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Pedido {order.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-semibold mb-2">{order.customer.name}</h2>
            <Link href={`/customers/${order.customer.id}`}>
              <div className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                Ver detalhes <ExternalLink className="size-4 ml-2" />
              </div>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Phone className="size-4" />
            <p>{order.customer.phone}</p>
          </div>
        </div>

        <div className="sm:text-end space-y-2">
          <h3 className="text-4xl font-semibold">{formatPrice(order.total)}</h3>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4" />
            <p>{formatDate(order.createdAt)}</p>
          </div>
          <Badge>{order.status}</Badge>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {order.items.map((orderItem) => (
          <Card key={orderItem.id}>
            <CardHeader>
              <CardTitle>{orderItem.item.name}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-semibold">{formatPrice(orderItem.subtotal)}</p>
              <p className="text-sm text-muted-foreground font-semibold">
                {orderItem.quantity} x {formatPrice(orderItem.item.price)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
