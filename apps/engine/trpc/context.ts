import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { prisma } from "../lib/prisma";

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;

export function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = { name: req.headers.get("username") ?? "anonymous" };
  return { req, resHeaders, user, prisma };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
