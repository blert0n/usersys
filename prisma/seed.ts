import { prisma } from "@/server/prisma";
import { faker } from "@faker-js/faker";

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "Admin", color: "#158149" },
      { name: "Data import", color: "#3d6aad" },
      { name: "Data export", color: "#6148a2" },
      { name: "Viewer", color: "#ff9933" },
      { name: "Editor", color: "#33ccff" },
    ],
    skipDuplicates: true,
  });

  const roles = await prisma.role.findMany();

  const users = Array.from({ length: 100 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    roleNames: faker.helpers.arrayElements(
      roles.map((r) => r.name),
      { min: 0, max: 3 }
    ),
  }));

  for (const user of users) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        roles: {
          create: user.roleNames.map((roleName) => ({
            role: {
              connect: { id: roles.find((r) => r.name === roleName)!.id },
            },
          })),
        },
      },
    });
  }

  console.log(`Seeded ${users.length} random users!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
