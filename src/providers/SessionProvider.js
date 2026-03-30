"use client";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { Fragment } from "react";
import { Toaster } from "sonner";

export function NextAuthProvider({ children }) {
  return (
    <Fragment>
      <Toaster position="bottom-right" duration={4000} richColors />
      <NextTopLoader
        color="#87dac9"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        zIndex={1600}
        showAtBottom={false}
      />
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
        {children}
      </SessionProvider>
    </Fragment>
  );
}
