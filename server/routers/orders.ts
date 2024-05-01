import { z } from "zod";
import { procedure, router } from "../trpc";
import { OrderStatus, Prisma } from "@prisma/client";
import { paginate } from "@/lib/pagination";

const CreateOrderInput = z.object({
  customerId: z.string(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number(),
    })
  ),
});

const UpdateOrderInput = z.object({
  id: z.string(),
  status: z.nativeEnum(OrderStatus),
});

export const ordersRouter = router({
  getAll: procedure
    .input(
      z.object({
        sort: z.enum(["name", "description", "price", "categoryId", "createdAt"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
        take: z.number().optional(),
        page: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const args = {} as Prisma.OrderFindManyArgs;

      if (input.sort) {
        args.orderBy = { [input.sort]: input.order || "asc" };
      }

      const page = input.page ?? 1;
      const limit = input.take ?? 10;

      const meta = paginate({
        total: await ctx.prisma.order.count({ where: args.where }),
        page,
        limit,
      });

      args.take = limit;
      args.skip = meta.offset;

      const data = await ctx.prisma.order.findMany({ ...args });

      return { data, meta };
    }),

  getOne: procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: { id: input.id },
      include: { customer: true, items: true },
    });

    return order;
  }),

  create: procedure.input(CreateOrderInput).mutation(async ({ ctx, input }) => {
    const data = await Promise.all(
      input.items.map(async (item) => {
        const menuItem = await ctx.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });

        if (!menuItem) {
          throw new Error(`MenuItem with id ${item.menuItemId} not found`);
        }

        const subtotal = menuItem.price * item.quantity;

        return { menuItem, quantity: item.quantity, subtotal };
      })
    );

    const total = data.reduce((acc, curr) => acc + curr.subtotal, 0);

    const newOrder = await ctx.prisma.order.create({
      data: {
        customerId: input.customerId,
        total,
        status: "PENDING",
        items: {
          createMany: {
            data: data.map(({ menuItem, quantity, subtotal }) => ({
              itemId: menuItem.id,
              quantity,
              subtotal,
            })),
          },
        },
      },
    });

    return newOrder;
  }),

  update: procedure.input(UpdateOrderInput).mutation(async ({ ctx, input }) => {
    const newOrder = await ctx.prisma.order.update({ where: { id: input.id }, data: input });
    return newOrder;
  }),
});
