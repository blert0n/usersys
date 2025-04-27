import { router, publicProcedure } from "../trpc";
import type { Prisma } from "../../../generated/prisma";
import { z } from "zod";
import { prisma } from "@/server/prisma";

const defaultUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

export const userRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        limit: z.number().min(1).max(5).nullish(),
        skip: z.number().nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const users = await prisma.user.findMany({
        select: defaultUserSelect,
        skip: input.skip ?? 0,
        take: input.limit ?? 5,
        where: {
          ...(input.search
            ? {
                OR: [
                  { name: { contains: input.search, mode: "insensitive" } },
                  { email: { contains: input.search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        users,
      };
    }),
  total: publicProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(
      async ({ input }) =>
        await prisma.user.count({
          where: {
            ...(input.search
              ? {
                  OR: [
                    { name: { contains: input.search, mode: "insensitive" } },
                    { email: { contains: input.search, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
        })
    ),
  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().min(1),
        roles: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          roles: {
            create: input.roles.map((role) => ({
              roleId: role,
            })),
          },
        },
        select: defaultUserSelect,
      });

      return user;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        email: z.string().email().min(1),
        oldRoles: z.array(z.number()),
        updatedRoles: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: {
            set: input.name,
          },
          email: {
            set: input.email,
          },
        },
        select: defaultUserSelect,
      });

      const rolesToAdd = input.updatedRoles.filter(
        (roleId) => !input.oldRoles.includes(roleId)
      );
      const rolesToRemove = input.oldRoles.filter(
        (roleId) => !input.updatedRoles.includes(roleId)
      );

      await prisma.userRole.createMany({
        data: rolesToAdd.map((roleId) => ({
          userId: input.id,
          roleId,
        })),
        skipDuplicates: true,
      });

      await prisma.userRole.deleteMany({
        where: {
          userId: input.id,
          roleId: {
            in: rolesToRemove,
          },
        },
      });

      return user;
    }),
  deleteOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.userRole.deleteMany({
        where: {
          userId: input.id,
        },
      });
      const user = await prisma.user.delete({
        where: {
          id: input.id,
        },
      });
      return user;
    }),
  deleteMany: publicProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.userRole.deleteMany({
        where: {
          userId: {
            in: input.ids,
          },
        },
      });
      const user = await prisma.user.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      return user;
    }),
});
