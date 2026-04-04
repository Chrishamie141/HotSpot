import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@nightpulse.app" },
    update: { role: UserRole.ADMIN },
    create: { email: "admin@nightpulse.app", displayName: "NightPulse Admin", role: UserRole.ADMIN }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
