import { AppRouter } from "@/server/routers/_app";
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config(opts) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
