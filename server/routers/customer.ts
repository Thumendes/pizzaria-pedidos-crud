import { z } from "zod";
import { procedure, router } from "../trpc";
import { Prisma } from "@prisma/client";
import { paginate } from "@/lib/pagination";

const CreateCustomerInput = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
});

const UpdateCustomerInput = CreateCustomerInput.partial().and(z.object({ id: z.string() }));

export const customersRouter = router({
  getAll: procedure
    .input(
      z.object({
        sort: z.enum(["name", "email", "phone", "createdAt"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
        search: z.string().optional(),
        take: z.number().optional(),
        page: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const args = {} as Prisma.CustomerFindManyArgs;

      if (input.search) {
        args.where = { ...args.where, name: { contains: input.search } };
      }

      if (input.sort) {
        args.orderBy = { [input.sort]: input.order || "asc" };
      }

      const page = input.page ?? 1;
      const limit = input.take ?? 10;

      const meta = paginate({
        total: await ctx.prisma.customer.count({ where: args.where }),
        page,
        limit,
      });

      args.take = limit;
      args.skip = meta.offset;

      const data = await ctx.prisma.customer.findMany({ ...args });

      return { data, meta };
    }),

  getOne: procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const customer = await ctx.prisma.customer.findUnique({ where: { id: input.id } });
    return customer;
  }),

  getOrders: procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const orders = await ctx.prisma.order.findMany({ where: { customerId: input.id } });
    return orders;
  }),

  create: procedure.input(CreateCustomerInput).mutation(async ({ ctx, input }) => {
    const newCustomer = await ctx.prisma.customer.create({ data: input });
    return newCustomer;
  }),

  update: procedure.input(UpdateCustomerInput).mutation(async ({ ctx, input }) => {
    const newCustomer = await ctx.prisma.customer.update({ where: { id: input.id }, data: input });
    return newCustomer;
  }),

  delete: procedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const customer = await ctx.prisma.customer.delete({ where: { id: input.id } });
    return customer;
  }),
});
