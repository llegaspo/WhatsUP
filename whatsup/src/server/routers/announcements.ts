import { router, publicProcedure } from '../trpc'
import { z } from 'zod';
import { DeleteAnnouncementSchema,
         AddAnnouncementSchema,
         EditAnnouncementSchema} from '@/utils/schema/AnnouncementSchema'
import { prisma } from '@/server/db';


export const announcementRouter = router({
  create: publicProcedure
    .input(AddAnnouncementSchema)
    .mutation(async ({input}) =>{
      try{

        const newAnnouncement= await prisma.announcement.create({
          data: {
            userID: '',
            title: input.title,
            createdBy: input.createdBy,
            createdAt: input.createdAt,
            source: input.source,
            description: input.description?.trim() || undefined,
            sourceLink: input.sourceLink?.trim() || undefined,
            imageLink: input.imageLink?.trim() || undefined,
            fbPost: input.fbPostID ? {connect: {id: input.fbPostID}}: undefined,
        }

      });

      //connect the created annoucement to the facebook post it refers
      if(input.fbPostID){
        await prisma.facebookPost.update({
          where: {id: input.fbPostID},
          data: {annID: newAnnouncement.id}
        })
      }



      if(newAnnouncement)
        return {message: 'Announcement created Successfully'}
      else
        return {message: 'Announcement cannot be created'}
 }
    catch(e){
      throw new Error("An error has occured.")
    }
  }),

  fetch: publicProcedure
    .input(z.string()) //announcement id
    .query(async ({input}) => {
      try{
        const announcementResult = await prisma.announcement.findUnique({
          where:{
            id: input
        },
      })
      if(!announcementResult){
        return {message: 'No such announcement exist.'}
      }
      return announcementResult;
    } catch (e){
      throw new Error("An error has occured while fetching announcement")
    }
  }),

  fetchAll: publicProcedure
    .query(async () => {
    try{
      const announcements = await prisma.announcement.findMany();
      if(!announcements)
        return {message: 'Announcements cannot be fetched.'}
      return announcements;
    } catch(e){
      throw new Error('An error has occured while fetching announcements.')
    }
  }),

  delete: publicProcedure
    .input(DeleteAnnouncementSchema)
    .mutation(async ({input}) => {
      try{
        const announcementDelete = await prisma.announcement.delete({
          where:{
            id: input.id,
        }
      })

      if(!announcementDelete)
        return {message: 'No such to do announcement.'}
      return {message: 'Announcement has been removed successfully.'}
    } catch(e){
        throw new Error('An error has occured while deleting the announcement')
    }
  }),

  update: publicProcedure
    .input(EditAnnouncementSchema)
    .mutation(async ({input}) => {
      try{
        const announcementUpdate = await prisma.announcement.update({
          where: {
            id: input.id,
        },
          data:{
            title: input.title,
            imageLink: input.imageLink?.trim() || undefined,
            description: input.description?.trim() || undefined,
            createdBy: input.createdBy,
            createdAt: input.createdAt,
            source: input.source,
            sourceLink: input.sourceLink?.trim() || undefined,
            fbPost: input.fbPostID ? {connect: {id: input.fbPostID}} : undefined
      }
      });

      if(!announcementUpdate)
        return {message: "Cannot update announcement."}
    } catch(e){
      throw new Error("An error has occured while updating the announcement.")
    }
  })
})


