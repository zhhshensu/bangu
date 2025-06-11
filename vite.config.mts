import { rmSync } from "node:fs";
import { builtinModules } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TanStackRouterGeneratorVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import ElectronPlugin, { type ElectronOptions } from "vite-plugin-electron";
import RendererPlugin from "vite-plugin-electron-renderer";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const isDevEnv = process.env.NODE_ENV === "development";

export default defineConfig(({ mode }) => {
  process.env = {
    ...(isDevEnv
      ? {
          ELECTRON_ENABLE_LOGGING: "true",
        }
      : {}),
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  rmSync("dist", { recursive: true, force: true });

  const electronPluginConfigs: ElectronOptions[] = [
    {
      entry: "src/main/index.ts",
      onstart({ startup }) {
        startup();
      },
      vite: {
        root: resolve("."),
        build: {
          assetsDir: ".",
          outDir: "dist/main",
          rollupOptions: {
            external: ["electron", ...builtinModules],
          },
        },
      },
    },
    {
      entry: "src/preload/index.ts",
      onstart({ reload }) {
        reload();
      },
      vite: {
        root: resolve("."),
        build: {
          outDir: "dist/preload",
        },
      },
    },
  ];

  if (isDevEnv) {
    electronPluginConfigs.push({
      entry: "src/main/index.dev.ts",
      vite: {
        root: resolve("."),
        build: {
          outDir: "dist/main",
        },
      },
    });
  }

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".tsx", ".json", ".scss"],
      alias: {
        "@": resolve(dirname(fileURLToPath(import.meta.url)), "src"),
      },
    },
    base: "./",
    root: resolve("./src/renderer"),
    publicDir: resolve("./src/renderer/public"),
    clearScreen: false,
    build: {
      sourcemap: isDevEnv,
      // minify: !isDevEnv,
      outDir: resolve("./dist"),
      rollupOptions: {
        input: {
          main: resolve("./src/renderer/index.html"),
          header: resolve("./src/renderer/containers/header/index.html"),
        },
      },
    },
    // https://pglite.dev/docs/bundler-support
    optimizeDeps: {
      exclude: [],
    },
    plugins: [
      tailwindcss(),
      react(),
      tsconfigPaths(),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      ElectronPlugin(electronPluginConfigs),
      RendererPlugin(),
      TanStackRouterGeneratorVite({
        routesDirectory: resolve(process.cwd(), "./src/renderer/routes"),
        generatedRouteTree: resolve(process.cwd(), "./src/renderer/routeTree.gen.ts"),
        routeFileIgnorePrefix: "-",
        quoteStyle: "single",
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:9000",
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
