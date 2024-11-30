import { FileServer, HttpContext } from "@common-module/server";
import Config from "./Config.js";
import OpenAI from "openai";

class EditorServer extends FileServer {
  constructor(
    private config: Config,
    listener?: (context: HttpContext) => Promise<void>,
  ) {
    super(config, listener);
  }

  protected modifyIndexFileContent(content: string): string {
    const publicConfig: any = { ...this.config };

    delete publicConfig.openAIApiKey;
    delete publicConfig.webServerPort;
    delete publicConfig.webServerSSL;
    delete publicConfig.httpPortForRedirect;
    delete publicConfig.autoRenewCertbot;

    return content.replace(
      "<!-- CONFIG HERE -->",
      `<script>window.config = ${JSON.stringify(publicConfig)};</script>`,
    );
  }
}

export default async function run(config: Config) {
  const client = new OpenAI({ apiKey: config.openAIApiKey });

  /*const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Say this is a test" }],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }*/

  new EditorServer(config, async (ctx) => {
    console.log(ctx.uri);
  });
}
