import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApi } from "@/lib/trpc/api";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface OrderCountStatProps {}

export async function OrderCountStat({}: OrderCountStatProps) {
  const api = await createApi();
  const countOrders = await api.charts.countOrders.query();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantidade de pedidos</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-end">
          <p className="text-3xl font-semibold">{countOrders.count}</p>
          <Link href="/orders">
            <div className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              Ver <ExternalLink className="size-4 ml-2" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
