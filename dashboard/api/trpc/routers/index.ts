import { router } from '../trpc';
import { userRouter } from './user';
import { postRouter } from './post';
import { aiRouter } from './ai';
import { analyticsRouter } from './analytics';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  ai: aiRouter,
  analytics: analyticsRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;