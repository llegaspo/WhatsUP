import { router, publicProcedure } from '../trpc'
import { EditUserSchema,
         DeleteUserSchema,
         RegisterSchema,
         FetchUserSchema} from '@/utils/schema/UserSchema'
import { prisma } from '@/server/db';


export const userRouter = router({
  create: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({input}) =>{
      try{
        const newUser = await prisma.user.create({
          data: {
            ...input,
          createdAt: new Date(),
          role: 'USER',
          last_login_at: new Date(),
        },
      });
      if(newUser)
        return {message: 'User Created Successfully'}
      else
        return {message: 'User cannot be created'}
 }
    catch(e){
      throw new Error("An error has occured.")
    }
  }),

  fetch: publicProcedure
    .input(FetchUserSchema)
    .query(async ({input}) => {
      try{
        const userResult = await prisma.user.findUnique({
          where:{
            id: input.id
        },
      })
      if(!userResult){
        return {message: 'No such user exist.'}
      }
      return userResult;
    } catch (e){
      throw new Error("An error has occured while fetching user")
    }
  }),

  fetchAll: publicProcedure
    .query(async () => {
    try{
      const users = await prisma.user.findMany();
      if(!users)
        return {message: 'Users cannot be fetched.'}
      return users;
    } catch(e){
      throw new Error('An error has occured while fetching users.')
    }
  }),

  delete: publicProcedure
    .input(DeleteUserSchema)
    .mutation(async ({input}) => {
      try{
        const userDelete = await prisma.user.delete({
          where:{
            id: input.id,
        }
      })

      if(!userDelete)
        return {message: 'No such user exist.'}
      return {message: 'User has been removed successfully.'}
    } catch(e){
        throw new Error('An error has occured while deleting user')
    }
  }),

  update: publicProcedure
    .input(EditUserSchema)
    .mutation(async ({input}) => {
      try{
        const userUpdate = await prisma.user.update({
          where: {
            id: input.id,
        },
          data:{
            fname: input.fname,
            mname: input.mname,
            lname: input.lname,
            username: input.username,
            email: input.email,
            password: input.password,
      }
      });

      if(!userUpdate)
        return {message: "Cannot update user's credentials."}
    } catch(e){
      throw new Error("An error has occured while updating the user.")
    }
  })
})
