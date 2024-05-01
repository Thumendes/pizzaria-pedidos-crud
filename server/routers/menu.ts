import { z } from "zod";
import { procedure, router } from "../trpc";
import { Prisma } from "@prisma/client";
import { paginate } from "@/lib/pagination";

const CreateMenuItemInput = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.string(),
});

const UpdateMenuItemInput = CreateMenuItemInput.partial().and(z.object({ id: z.string() }));

export const menuRouter = router({
  categories: procedure.query(async ({ ctx, input }) => {
    const data = await ctx.prisma.menuItemCategory.findMany();
    return data;
  }),

  getItems: procedure
    .input(
      z.object({
        sort: z.enum(["name", "description", "price", "categoryId", "createdAt"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
        search: z.string().optional(),
        take: z.number().optional(),
        page: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const args = {} as Prisma.MenuItemFindManyArgs;

      if (input.search) {
        args.where = {
          ...args.where,
          OR: [
            ...(args.where?.OR ?? []),
            { name: { contains: input.search } },
            { description: { contains: input.search } },
          ],
        };
      }

      if (input.sort) {
        args.orderBy = { [input.sort]: input.order || "asc" };
      }

      const page = input.page ?? 1;
      const limit = input.take ?? 10;

      const meta = paginate({
        total: await ctx.prisma.menuItem.count({ where: args.where }),
        page,
        limit,
      });

      args.take = limit;
      args.skip = meta.offset;

      const data = await ctx.prisma.menuItem.findMany({ ...args, include: { category: { select: { name: true } } } });

      return { data, meta };
    }),

  getOneItem: procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const menuItem = await ctx.prisma.menuItem.findUnique({ where: { id: input.id } });
    return menuItem;
  }),

  createItem: procedure.input(CreateMenuItemInput).mutation(async ({ ctx, input }) => {
    const newItem = await ctx.prisma.menuItem.create({ data: input });
    return newItem;
  }),

  updateItem: procedure.input(UpdateMenuItemInput).mutation(async ({ ctx, input }) => {
    const newItem = await ctx.prisma.menuItem.update({ where: { id: input.id }, data: input });
    return newItem;
  }),

  deleteItem: procedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const menuItem = await ctx.prisma.menuItem.delete({ where: { id: input.id } });
    return menuItem;
  }),
});
