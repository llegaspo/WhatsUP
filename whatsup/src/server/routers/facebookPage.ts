import { router, publicProcedure } from '../trpc'
import { z } from 'zod';
import { DeleteFacebookPageSchema,
         AddFacebookPageSchema,
         EditFacebookPageSchema} from '@/utils/schema/FacebookPageSchema'
import { prisma } from '@/server/db';


export const facebookPageRouter = router({
  create: publicProcedure
    .input(AddFacebookPageSchema)
    .mutation(async ({input}) =>{
      try{
        const newFBPage = await prisma.fBPage.create({
          data: input,
      });
      if(newFBPage)
        return {message: 'FacebookPage created Successfully'}
      else
        return {message: 'FacebookPage cannot be created'}
 }
    catch(e){
      throw new Error("An error has occured.")
    }
  }),

  fetch: publicProcedure
    .input(z.string()) //pageName
    .query(async ({input}) => {
      try{
        const facebookPageResult = await prisma.fBPage.findUnique({
          where:{
            pageName: input
        },
      })
      if(!facebookPageResult){
        return {message: 'No such facebook page exist.'}
      }
      return facebookPageResult;
    } catch (e){
      throw new Error("An error has occured while fetching announcement")
    }
  }),

  fetchAll: publicProcedure
    .query(async () => {
    try{
      const FBPages = await prisma.fBPage.findMany();
      if(!FBPages)
        return {message: 'facebook page cannot be fetched.'}
      return FBPages;
    } catch(e){
      throw new Error('An error has occured while fetching facebook page.')
    }
  }),

  delete: publicProcedure
    .input(DeleteFacebookPageSchema)
    .mutation(async ({input}) => {
      try{
        const fbPageDelete = await prisma.fBPage.delete({
          where:{
            pageName: input.pageName,
        }
      })

      if(!fbPageDelete)
        return {message: 'No such facebook page.'}
      return {message: 'Facebook page has been removed successfully.'}
    } catch(e){
        throw new Error('An error has occured while deleting the facebook page')
    }
  }),

  update: publicProcedure
    .input(EditFacebookPageSchema)
    .mutation(async ({input}) => {
      try{
        const fbPageUpdate = await prisma.fBPage.update({
          where: {
            pageName: input.pageName,
        },
          data:{
            url: input.url,
            type: input.type,
      }
      });

      if(!fbPageUpdate)
        return {message: "Cannot update facebook page."}
    } catch(e){
      throw new Error("An error has occured while updating the facebook page.")
    }
  })
})



