import express from "express";
import cors from "cors";
import pinoHttp from 'pino-http';
import router from "@/routes";
import { logger } from "@/utils/logger";

const app = express();

app.use(cors());
app.use(express.json());

app.use(pinoHttp({ logger }));

app.use(router);

export default app;
