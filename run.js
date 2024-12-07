import server from "./dist/server.js";
import "dotenv/config";

server({
  webServerPort: 8080,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
