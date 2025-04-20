const { PrismaClient } = require("../generated/prisma")
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    const messages = Array.from({ length: 50 }).map(() => ({
        username: faker.internet.userName(),
        message: faker.lorem.sentence(),
        date: faker.date.recent(10),
    }));

    await prisma.message.createMany({
        data: messages,
        skipDuplicates: true,
    });

    console.log('Seeded messages!');
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
