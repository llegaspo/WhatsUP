import { router, publicProcedure } from '../trpc'
import { z } from 'zod';
import { DeleteFacebookPostSchema,
         AddFacebookPostSchema,
         EditFacebookPostSchema} from '@/utils/schema/FacebookPostSchema'
import { prisma } from '@/server/db';


export const facebookPostRouter = router({
  create: publicProcedure
    .input(AddFacebookPostSchema)
    .mutation(async ({input}) =>{
      try{
        const newFBPost= await prisma.facebookPost.create({
          data:{
            annID: undefined,
            userID: '',
            pageName: input.pageName?.trim() || undefined,
            fbPostID: input.fbPostID,
            author: input.author,
            content: input.content,
            url: input.url,
            createdAt: input.createdAt,
            status: input.status
        } ,
      });


      if(newFBPost)
        return {message: 'FacebookPost create Successfully'}
      else
        return {message: 'FacebookPost cannot be created'}
 }
    catch(e){
      throw new Error("An error has occured.")
    }
  }),

  fetch: publicProcedure
    .input(z.string()) //post id
    .query(async ({input}) => {
      try{
        const facebookPostResult = await prisma.facebookPost.findUnique({
          where:{
            id: input
        },
      })
      if(!facebookPostResult){
        return {message: 'No such facebook post exist.'}
      }
      return facebookPostResult;
    } catch (e){
      throw new Error("An error has occured while fetching facebook post")
    }
  }),

  fetchAll: publicProcedure
    .query(async () => {
    try{
      const facebookPosts = await prisma.facebookPost.findMany();
      if(!facebookPosts)
        return {message: 'Facebook posts cannot be fetched.'}
      return facebookPosts;
    } catch(e){
      throw new Error('An error has occured while fetching facebook posts.')
    }
  }),

  delete: publicProcedure
    .input(DeleteFacebookPostSchema)
    .mutation(async ({input}) => {
      try{
        const facebookPostDelete = await prisma.facebookPost.delete({
          where:{
            id: input.id,
        }
      })

      if(!facebookPostDelete)
        return {message: 'No such facebook post exist.'}
      return {message: 'Facebook post has been removed successfully.'}
    } catch(e){
        throw new Error('An error has occured while deleting the facebook post')
    }
  }),

  update: publicProcedure
    .input(EditFacebookPostSchema)
    .mutation(async ({input}) => {
      try{
      const {id, ...dataWithoutID} = input;
        const facebookPostUpdate = await prisma.facebookPost.update({
          where: {
            id: id,
        },
          data: dataWithoutID,
      });


      if(!facebookPostUpdate)
        return {message: "Cannot update facebook post."}
      return {message: "Facebook post updated successufully"}
    } catch(e){
      throw new Error("An error has occured while updating the facebook post.")
    }
  })
})




