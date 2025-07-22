type RuntimeEnv = {
    VITE_BACKEND_URL: string;
};

declare global {
    interface Window {
        env?: Partial<RuntimeEnv>;
    }
}

export const env: RuntimeEnv = {
    VITE_BACKEND_URL:
        window?.env?.VITE_BACKEND_URL ?? "http://localhost:8081",
};
