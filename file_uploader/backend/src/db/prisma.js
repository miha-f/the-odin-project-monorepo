import { PrismaClient } from '../generated/prisma/index.js';

let prisma;

if (process.env.NODE_ENV === "test") {
    const { default: mockPrisma } = await import('./prismaMock.js');
    prisma = mockPrisma;
} else {
    prisma = new PrismaClient();
}

export default prisma;
