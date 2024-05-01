import "server-only";

import { AppRouter, appRouter } from "@/server/router";
import { TRPCClientError, createTRPCProxyClient, loggerLink } from "@trpc/client";
import { cache } from "react";
import { observable } from "@trpc/server/observable";
import { callProcedure } from "@trpc/server";
import { createTRPCContext } from "@/server/context";
import { cookies } from "next/headers";
import { TRPCErrorResponse } from "@trpc/server/rpc";

export const createApi = cache(async () => {
  const cookie = cookies().toString();
  const ctx = await createTRPCContext({ headers: new Headers({ cookie, "x-trpc-source": "rsc" }) });

  return createTRPCProxyClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
      }),
      () =>
        ({ op }) =>
          observable((observer) => {
            callProcedure({
              procedures: appRouter._def.procedures,
              path: op.path,
              rawInput: op.input,
              ctx,
              type: op.type,
            })
              .then((data) => {
                observer.next({ result: { data } });
                observer.complete();
              })
              .catch((cause: TRPCErrorResponse) => {
                observer.error(TRPCClientError.from(cause));
              });
          }),
    ],
  });
});
