import { router } from "./trpc";
import { userRouter } from "./routers/users";
import { facebookPageRouter } from "./routers/facebookPage";

export const appRouter = router({
  user: userRouter,
  fbPage: facebookPageRouter,
});

export type AppRouter = typeof appRouter;
