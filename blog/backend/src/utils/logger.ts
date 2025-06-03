import pino from "pino";

export const logger = pino({
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss.l',
                    ignore: 'pid,hostname',
                },
                level: 'debug',
            },
            {
                target: 'pino-roll',
                options: {
                    file: './logs/app.log',
                    mkdir: true,
                    size: '10m',
                    limit: {
                        count: 5
                    },
                },
            },
        ],
    },
});

