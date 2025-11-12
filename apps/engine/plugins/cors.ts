import { isPreflightRequest } from "nitro/deps/h3";
import { defineNitroPlugin } from "nitro/~internal/runtime/plugin";

export default defineNitroPlugin((nitroApp) => {
  const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

  const applyCorsHeaders = (event: any) => {
    const reqOrigin = event.node.req.headers.origin;
    const origin = allowedOrigins.includes(reqOrigin ?? "") ? reqOrigin : null;

    if (origin) {
      event.node.res.setHeader("Access-Control-Allow-Origin", origin);
    }
    event.node.res.setHeader("Vary", "Origin");
    event.node.res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    event.node.res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, trpc-batch-mode"
    );
    event.node.res.setHeader("Access-Control-Allow-Credentials", "true");
  };

  // ✅ 1. Apply before routes (preflight + early setup)
  nitroApp.hooks.hook("request", async (event: any) => {
    applyCorsHeaders(event);

    if (isPreflightRequest(event)) {
      event.node.res.statusCode = 204;
      event.node.res.end();
      return;
    }
  });

  // ✅ 2. Apply after route handlers finish (covers normal responses)
  nitroApp.hooks.hook("response", async (event: any) => {
    applyCorsHeaders(event);
  });
});
