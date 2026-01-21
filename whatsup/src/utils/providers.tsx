"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "@/server/client";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </SessionProvider>
  );
}
