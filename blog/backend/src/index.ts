import dotenv from "dotenv";
dotenv.config();
import app from "@/app.ts";
import { logger } from "@/utils/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
