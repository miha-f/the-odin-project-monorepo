import dotenv from "dotenv";
dotenv.config();
import { createApp } from "@/app.ts";
import { logger } from "@/utils/logger";
import { prisma } from "@/db/prismaDb";

const PORT = process.env.PORT || 3005;

const app = createApp(prisma, true)

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
