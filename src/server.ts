import {
  FileServer,
  HttpContext,
  WebSocketServer,
} from "@common-module/server";
import OpenAI from "openai";
import Config from "./Config.js";
import MessageFileManager, { Message } from "./server/MessageFileManager.js";

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

export default async function server(config: Config) {
  const openAIClient = new OpenAI({ apiKey: config.openAIApiKey });

  const server = new EditorServer(config, async (ctx) => {
    console.log(ctx.uri);
  });

  new WebSocketServer<{
    join: (channel: string) => Promise<Message[]>;
    chat: (targetMessageId: string, message: string) => void;
  }>(server, (channelManager) => {
    let joinedChannel: string | undefined;

    channelManager.on("system", "join", async (channel) => {
      if (joinedChannel) channelManager.off(joinedChannel, "chat");
      joinedChannel = channel;

      channelManager.on(
        channel,
        "chat",
        async (targetMessageId: string, message: string) => {
          const stream = await openAIClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }],
            stream: true,
          });
          for await (const chunk of stream) {
            channelManager.send(
              channel,
              "messageChunk",
              targetMessageId,
              chunk.choices[0]?.delta?.content || "",
            );
          }
        },
      );

      channelManager.send("system", "joined", channel);

      return await MessageFileManager.readChannelMessages(channel);
    });
  });
}
