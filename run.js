import server from "./dist/server/server.js";
import "dotenv/config";

server({
  webServerPort: 8080,
  openAIApiKey: process.env.OPENAI_API_KEY,
  serverUrl: "http://localhost:8080",
});
