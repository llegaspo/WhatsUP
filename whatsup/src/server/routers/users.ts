import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  EditUserSchema,
  DeleteUserSchema,
  RegisterSchema,
  FetchUserSchema,
} from "@/utils/schema/UserSchema";
import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";

export const userRouter = router({
  create: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.prisma.user.findFirst({
        where: {
          OR: [{ email: input.email }, { username: input.username }],
        },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email or username already exists.",
        });
      }

      // 2. Hash Password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const { confirmPassword, confirmEmail, password, ...userData } = input;

      try {
        const newUser = await ctx.prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
            role: "USER",
            last_login_at: new Date(),
          },
        });

        return {
          message: "User Created Successfully",
          userId: newUser.id,
        };
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while creating the account.",
        });
      }
    }),

  fetch: publicProcedure
    .input(FetchUserSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    return users;
  }),

  delete: protectedProcedure
    .input(DeleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.id !== input.id /* && !isAdmin */) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own account",
          });
        }
        const userDelete = await ctx.prisma.user.delete({
          where: {
            id: input.id,
          },
        });

        return { message: "User has been removed successfully." };
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found or already deleted.",
        });
      }
    }),

  update: protectedProcedure
    .input(EditUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { password, ...otherData } = input;
      const dataToUpdate: any = { ...otherData };

      if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        dataToUpdate.password = hashedPassword;
      }
      try {
        const userUpdate = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: dataToUpdate,
        });

        if (!userUpdate)
          return { message: "Cannot update user's credentials." };

        return { message: "Profile updated successfully", user: userUpdate };
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username or Email already taken",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),
});
