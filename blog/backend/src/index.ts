import dotenv from "dotenv";
dotenv.config();
import { createApp } from "@/app.ts";
import { logger } from "@/utils/logger";
import prismaDb from "@/db/prismaDb";

const PORT = process.env.PORT || 3005;

const app = createApp(prismaDb)

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
