import { createCallerFactory, router } from "../trpc";
import { roleRouter } from "./roles";
import { userRouter } from "./users";

export const appRouter = router({
  user: userRouter,
  role: roleRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
