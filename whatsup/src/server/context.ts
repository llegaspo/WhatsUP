import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/server/db";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (opts?: FetchCreateContextFnOptions) => {
  const session = await getServerSession(authOptions);

  return {
    session,
    prisma,
    headers: opts?.req.headers,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
