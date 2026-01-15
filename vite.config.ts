import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "pth_to_lyt",
            fileName: (format) => `index.${format === "cjs" ? "cjs" : "js"}`,
            formats: ["es", "cjs"],
        },
        target: "node24",
        rollupOptions: {
            external: ["fs"],
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
});
