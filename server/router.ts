import { z } from "zod";
import { procedure, router } from "./trpc";
import { customersRouter } from "./routers/customer";
import { menuRouter } from "./routers/menu";
import { ordersRouter } from "./routers/orders";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  hello: procedure.input(z.object({ text: z.string() })).query((opts) => {
    return { greeting: `hello ${opts.input.text}` };
  }),

  customers: customersRouter,
  menu: menuRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
