import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  EditUserSchema,
  DeleteUserSchema,
  RegisterSchema,
  FetchUserSchema,
} from "@/utils/schema/UserSchema";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  email: true,
  role: true,
  createdAt: true,
  fname: true,
  lname: true,
  mname: true,
  image: true,
  name: true,
});

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

      const hashedPassword = await bcrypt.hash(input.password, 10);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, password, ...userData } = input;

      try {
        const newUser = await ctx.prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
            role: "USER",
            last_login_at: new Date(),
          },
          select: defaultUserSelect,
        });

        return {
          message: "User Created Successfully",
          userId: newUser.id,
        };
      } catch {
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
        select: defaultUserSelect,
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
    const users = await ctx.prisma.user.findMany({
      select: defaultUserSelect,
    });
    return users;
  }),

  delete: protectedProcedure
    .input(DeleteUserSchema)
    .mutation(async ({ ctx }) => {
      const userIdToDelete = ctx.session.user.id;

      try {
        await ctx.prisma.user.delete({
          where: {
            id: userIdToDelete,
          },
        });

        return { message: "User has been removed successfully." };
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found or already deleted.",
        });
      }
    }),

  update: protectedProcedure
    .input(EditUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { password, id, ...otherData } = input;
      const dataToUpdate: Prisma.UserUpdateInput = { ...otherData };

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
          select: defaultUserSelect,
        });

        return { message: "Profile updated successfully", user: userUpdate };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),
});
