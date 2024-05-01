import { prisma } from "@/lib/prisma";

export async function createTRPCContext(opts: { headers: Headers }) {
  return { prisma, ...opts };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
