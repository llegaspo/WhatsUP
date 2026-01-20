import { httpBatchLink} from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '@/server/server';

export const api = createTRPCNext<AppRouter>({
  config(){
      return{
        transformer: superjson,
        links: [
          httpBatchLink({
            url: `/api/trpc`,
        })
      ]
    }
  }
})
