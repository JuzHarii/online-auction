import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting database seeding...");

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.log("Error seeding database: ", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })