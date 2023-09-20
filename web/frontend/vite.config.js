import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import react from "@vitejs/plugin-react";
import vuePlugin from "rollup-plugin-vue";
// import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
import terser from '@rollup/plugin-terser';
import { copy } from "vite-plugin-copy";
import { chromeExtension } from "rollup-plugin-chrome-extension";
import extension from "rollup-plugin-browser-extension";
import htmlMinifier from 'vite-plugin-html-minifier'
// import 'dotenv/config'
// import { jsx } from '@emotion/react'
import { VitePWA } from 'vite-plugin-pwa';
if (
  process.env.npm_lifecycle_event === "build" &&
  !process.env.CI &&
  !process.env.SHOPIFY_API_KEY
) {
  console.warn(
    "\nBuilding the frontend app without an API key. The frontend build will not run without an API key. Set the SHOPIFY_API_KEY environment variable when running the build command.\n"
  );
}


const proxyOptions = {
  target: `http://127.0.0.1:${process.env.BACKEND_PORT}`,
  changeOrigin: false,
  secure: true,
  ws: false,
};

const host = process.env.HOST
  ? process.env.HOST.replace(/https?:\/\//, "")
  : "localhost";

let hmrConfig;
if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: process.env.FRONTEND_PORT,
    clientPort: 443,
  };
}

const dir_name = dirname(fileURLToPath(import.meta.url));
console.log("dir_name", dir_name);
export default defineConfig({
  // build: {
  //   minify: true, // Enables minification
  //   brotliSize: true, // Enables Brotli compression
  //   chunkSizeWarningLimit: 1000, // Adjust if needed
  //   terserOptions:{
  //     compress:{
  //       drop_console: true
  //     }
  //   }

  // },
  // esbuild: {
  //   drop: ['console', 'debugger'],
  // },

  root: dir_name,
  plugins: [
    terser({ compress:true, mangle:true,  maxWorkers: 5}),
    // react({}),
    react(
    //   {
    //   jsxImportSource: "@emotion/react",
    //   babel: {
    //     plugins: ["@emotion/babel-plugin"],
    //   },
    // }
    ),
    // VitePWA({ registerType: 'autoUpdate' }),
    // vuePlugin(),
    // vue({
    //   template: {
    //     isProduction: true,
    //   },
    // }),
 
  ,

    // copy({
    //   targets: [{ src: "node_modules/tinymce/**/*", dest: "tinymce" }],
    //   verbose: true,
    // }),
  ],
  // optimizeDeps: {
  //   //include: ["tinymce"], // Expose tinymce as a module
  // },

  define: {
    DEPLOYMENT_ENV: process.env.NODE_ENV === "production",
    API_URL: JSON.stringify(host),
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    // 'process.env.NODE_ENV': JSON.stringify('production')
  },
  resolve: {
    preserveSymlinks: true,
 
  },
  // esbuild: {
  //   // ...
  //   //  drop: ['console', 'debugger'],
  //   //  minifyIdentifiers: true,
  //   // minifySyntax: true,
  //   // minify: true,
  //   // mangleCaches: true,
  //   // mangleProps:true,
  //   // mangleQuoted:true,

  //   // splitting: {
  //   //   // Specify the maximum size for a single chunk (in bytes)
  //   //   maxChunkSize: 500000, // 500KB in this example
  //   // },
  // },

  build: {
    brotliSize: true, // Enables Brotli compression
    chunkSizeWarningLimit: 4000, 

    // minify: "terser", // <-- add
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true,
     
    //   },
    //   mangle :true,
    // },
  },
  server: {
    host: "localhost",
    port: process.env.FRONTEND_PORT,
    hmr: hmrConfig,
    proxy: {
      "^/(\\?.*)?$": proxyOptions,
      "^/api(/|(\\?.*)?$)": proxyOptions,
      "^/sse(/|(\\?.*)?$)": proxyOptions,
      "^/tinymce(/|(\\?.*)?$)": proxyOptions,
      // "^/*": proxyOptions,
      // "^/dist(/|(\\?.*)?$)": proxyOptions,
      // "^/dist/assets(/|(\\?.*)?$)": proxyOptions,
      // Add the ngrok tunnel URL as an allowed origin
      // "https://bit-enrolled-load-sections.trycloudflare.com": proxyOptions,
    },
  },
});
