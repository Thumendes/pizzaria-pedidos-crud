import { delay } from "@/lib/utils";
import { procedure, router } from "../trpc";
import { randomInt } from "crypto";

export const chartsRouter = router({
  countCustomers: procedure.query(async ({ ctx }) => {
    await delay(randomInt(500, 2000));
    const count = await ctx.prisma.customer.count();
    return { count };
  }),

  countOrders: procedure.query(async ({ ctx }) => {
    await delay(randomInt(500, 2000));
    const count = await ctx.prisma.order.count();
    return { count };
  }),

  countMenuItems: procedure.query(async ({ ctx }) => {
    await delay(randomInt(500, 2000));
    const count = await ctx.prisma.menuItem.count();
    return { count };
  }),

  mostRequestedMenuItems: procedure.query(async ({ ctx }) => {
    await delay(randomInt(500, 2000));
    const items = await ctx.prisma.orderItem.groupBy({
      by: ["itemId"],
      _count: { _all: true },
      orderBy: { _count: { itemId: "desc" } },
    });

    const itemsWithData = await Promise.all(
      items.map(async (item) => {
        const menuItem = await ctx.prisma.menuItem.findUnique({
          where: { id: item.itemId },
        });

        return { ...item, menuItem };
      })
    );

    return itemsWithData;
  }),
});
