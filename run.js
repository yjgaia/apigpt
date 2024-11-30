import run from "./dist/run.js";
import "dotenv/config";

run({
  webServerPort: 8080,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
