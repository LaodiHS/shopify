import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import react from "@vitejs/plugin-react";
//import react from "@vitejs/plugin-react-swc";
// import vue from "@vitejs/plugin-vue";
// import eslintPlugin from 'vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'

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
    overlay: true,
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


export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [
    react(
      //{ devTarget: "es2022" }
    ),
    vue({
      template: {
        compilerOptions: {
          // ...
        },
        transformAssetUrls: {
          // ...
        },
      },
    }),
  ],
  optimizeDeps: {
    web: ['vue'], // Include relevant libraries
  },
  define: {
    DEPLOYMENT_ENV: process.env.NODE_ENV === "production",
    API_URL: JSON.stringify(host),
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
  },
  esbuild: {
    pure: process.env.NODE_ENV === 'production' ? ['console.log', 'console.warn'] : [],
  },

  resolve: {
    preserveSymlinks: true,
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
    },
  },
});

  
   // 'process.env.NODE_ENV': JSON.stringify('production')
// build: {
//   // brotliSize: true, // Enables Brotli compression
//   // chunkSizeWarningLimit: 4000,
//   minify: false,
//    //minify: "terser", // <-- add
//   terserOptions: {
//     compress: {
//        drop_console: false,
//       drop_debugger: false,
//     },
//     mangle: false,
//   },
// },    // {
    // babel: {
    //  include: /\.(js|jsx)$/,
    //   plugins: ['babel-plugin-macros'],
    //    babelrc: true
    // },

    //}
    // react(
    // //   {
    // //   jsxImportSource: "@emotion/react",
    // //   babel: {
    // //     plugins: ["@emotion/babel-plugin"],
    // //   },
    // // }
    // ),
  // }
  
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
//   const dir_name = dirname(fileURLToPath(import.meta.url));
// console.log("dir_name", dir_name);