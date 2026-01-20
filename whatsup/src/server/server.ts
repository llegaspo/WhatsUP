import { router } from './trpc';
import { userRouter } from './routers/users';

export const appRouter  = router ({
  user: userRouter,

})

export type AppRouter = typeof appRouter;
