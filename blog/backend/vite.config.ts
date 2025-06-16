import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    build: {
        outDir: "dist",
        target: "node16",
        ssr: true,
        rollupOptions: {
            input: "src/index.ts",
            output: {
                format: "es",
            },
        },
    },
    test: {
        globals: true,
        environment: "node",
        silent: false,
        // setupFiles: ["./src/testSetup.ts"],
        // globalSetup: "./src/globalSetup.ts",
        // include: ["src/**/*.test.ts"],
    },
});
