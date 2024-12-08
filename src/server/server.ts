import {
  FileServer,
  HttpContext,
  WebSocketServer,
} from "@common-module/server";
import OpenAI from "openai";
import Config from "../Config.js";
import ChatClient from "./ChatClient.js";
import MessageFileManager from "./MessageFileManager.js";

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
    if (ctx.uri === "/api/rooms") {
      await ctx.apiResponse(await MessageFileManager.readChannels());
    } else if (ctx.uri === "/api/room/remove") {
      const data = await ctx.readData();
      await MessageFileManager.removeChannel(data.channel);
      await ctx.apiResponse("SUCCESS");
    }
  });

  new WebSocketServer(
    server,
    (channelManager) => new ChatClient(openAIClient, channelManager),
  );
}
