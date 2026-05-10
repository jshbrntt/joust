import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 3010,
        strictPort: true,
    },
    build: {
        target: "esnext",
        outDir: "dist",
        emptyOutDir: true,
    },
});
