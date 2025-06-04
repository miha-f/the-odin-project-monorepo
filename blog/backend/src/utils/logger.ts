import pino from "pino";

const LOG_FILE_PATH = process.env.LOG_FILE_PATH || "./logs/app.log";

export const logger = pino({
    transport: {
        targets: [
            {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "HH:MM:ss.l",
                    ignore: "pid,hostname",
                },
            },
            {
                target: "pino-roll",
                options: {
                    file: LOG_FILE_PATH,
                    mkdir: true,
                    size: "10m",
                    limit: {
                        count: 5
                    },
                },
            },
        ],
        level: "debug",
    },
});

