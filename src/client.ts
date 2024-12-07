import { WebSocketClient } from "@common-module/app";
import { MessageChannelManager } from "@common-module/ts";
import App from "./client/App.js";
import Config from "./Config.js";

const config = (window as any).config as Config;

new App();

const client = new WebSocketClient("http://localhost:8080/");
client.on("connect", () => {
  const channelManager = new MessageChannelManager<{
    joined: (channel: string) => void;
    messageChunk: (targetMessageId: string, chunk: string) => void;
  }>(client);

  const testChannel = "testChannel";

  channelManager.on(testChannel, "messageChunk", (targetMessageId, chunk) => {
    console.log(targetMessageId, chunk);
  });

  channelManager.on("system", "joined", (channel) => {
    //TEST
    if (channel === testChannel) {
      //channelManager.send(testChannel, "chat", "message-1", "Hello, AI!");
    }
  });

  channelManager.send("system", "join", testChannel);
});
