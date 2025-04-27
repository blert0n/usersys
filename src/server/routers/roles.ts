import { router, publicProcedure } from "../trpc";
import type { Prisma } from "../../../generated/prisma";
import { z } from "zod";
import { prisma } from "@/server/prisma";

const defaultRoleSelect = {
  id: true,
  name: true,
  color: true,
  _count: true,
} satisfies Prisma.RoleSelect;

export const roleRouter = router({
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
      const roles = await prisma.role.findMany({
        select: defaultRoleSelect,
        skip: input.skip ?? 0,
        take: input.limit ?? 5,
        where: {
          ...(input.search
            ? {
                OR: [
                  { name: { contains: input.search, mode: "insensitive" } },
                  { color: { contains: input.search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: {
          id: "desc",
        },
      });

      return {
        roles,
      };
    }),
  all: publicProcedure.query(
    async () =>
      await prisma.role.findMany({
        select: {
          id: true,
          name: true,
        },
      })
  ),
  total: publicProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(
      async ({ input }) =>
        await prisma.role.count({
          where: {
            ...(input.search
              ? {
                  OR: [
                    { name: { contains: input.search, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
        })
    ),
  upsert: publicProcedure
    .input(
      z.object({
        id: z.number().nullish(),
        name: z.string().min(1),
        color: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const role = await prisma.role.upsert({
        where: {
          id: input.id ?? 0,
        },
        create: {
          name: input.name,
          color: input.color,
        },
        update: {
          name: input.name,
          color: input.color,
        },
        select: defaultRoleSelect,
      });

      return role;
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
          roleId: input.id,
        },
      });
      const role = await prisma.role.delete({
        where: {
          id: input.id,
        },
      });
      return role;
    }),
});
