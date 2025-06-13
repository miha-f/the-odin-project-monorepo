import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
    const swaggerSpec = swaggerJsDoc({
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Blog API",
                version: "1.0.0",
            },
        },
        apis: ["./src/routes/*.ts"], // use relative or absolute paths
    });

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
