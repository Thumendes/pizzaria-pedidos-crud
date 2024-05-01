import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApi } from "@/lib/trpc/api";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface MenuCountStatProps {}

export async function MenuCountStat({}: MenuCountStatProps) {
  const api = await createApi();
  const countMenus = await api.charts.countMenuItems.query();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantidade de items no menu</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-end">
          <p className="text-3xl font-semibold">{countMenus.count}</p>
          <Link href="/menu">
            <div className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              Ver <ExternalLink className="size-4 ml-2" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
