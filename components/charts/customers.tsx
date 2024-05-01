import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApi } from "@/lib/trpc/api";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface CustomerCountStatProps {}

export async function CustomerCountStat({}: CustomerCountStatProps) {
  const api = await createApi();
  const countCustomers = await api.charts.countCustomers.query();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantidade de clientes</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-end">
          <p className="text-3xl font-semibold">{countCustomers.count}</p>
          <Link href="/customers">
            <div className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              Ver <ExternalLink className="size-4 ml-2" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
