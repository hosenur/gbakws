import { defineHandler, handleCors, isMethod } from "nitro/h3";

export default defineHandler((event) => {
  handleCors(event, {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  });
  if (isMethod(event, "OPTIONS")) {
    return "";
  }
});
