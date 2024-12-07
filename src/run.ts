import {
  FileServer,
  HttpContext,
  WebSocketServer,
} from "@common-module/server";
import OpenAI from "openai";
import Config from "./Config.js";

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
  const openAIClient = new OpenAI({ apiKey: config.openAIApiKey });

  const server = new EditorServer(config, async (ctx) => {
    console.log(ctx.uri);
  });

  new WebSocketServer<{
    join: (channel: string) => void;
    chat: (message: string) => void;
  }>(server, (channelManager) => {
    let joinedChannel: string | undefined;
    let requestIndex = 0;

    channelManager.on("system", "join", (channel) => {
      if (joinedChannel) channelManager.off(joinedChannel, "chat");
      joinedChannel = channel;

      channelManager.on(channel, "chat", async (message: string) => {
        const index = ++requestIndex;

        const stream = await openAIClient.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
          stream: true,
        });

        for await (const chunk of stream) {
          channelManager.send(
            channel,
            "messageChunk",
            chunk.choices[0]?.delta?.content || "",
          );
          if (index !== requestIndex) break;
        }
      });

      channelManager.send("system", "joined", channel);
    });
  });
}
