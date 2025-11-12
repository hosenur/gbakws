import { defineHandler } from "nitro/deps/h3";

export default defineHandler((event) => {
  return { status: 200, body: "Engine is running" };
});
