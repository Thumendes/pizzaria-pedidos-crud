import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createApi } from "@/lib/trpc/api";
import { formatPrice } from "@/lib/utils";

interface MostRequestMenuItemTableProps {}

export async function MostRequestMenuItemTable({}: MostRequestMenuItemTableProps) {
  const api = await createApi();
  const mostRequestedMenuItems = await api.charts.mostRequestedMenuItems.query();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mostRequestedMenuItems.map((item) => (
          <TableRow key={item.itemId}>
            <TableCell>
              <p className="font-medium text-lg">{item.menuItem?.name}</p>
              <span>{formatPrice(item.menuItem?.price!)}</span>
            </TableCell>
            <TableCell className="text-lg font-semibold text-right">{item._count._all}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
