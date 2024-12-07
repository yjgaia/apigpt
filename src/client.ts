import { WebSocketClient } from "@common-module/app";
import { ChannelManager } from "@common-module/ts";
import App from "./client/App.js";
import Config from "./Config.js";

const config = (window as any).config as Config;

new App();

const client = new WebSocketClient("http://localhost:8080/");
client.on("connect", () => {
  const channelManager = new ChannelManager<{
    joined: (channel: string) => void;
    messageChunk: (chunk: string) => void;
  }>(client);

  const testChannel = "testChannel";

  channelManager.on(testChannel, "messageChunk", (chunk) => {
    console.log(chunk);
  });

  channelManager.on("system", "joined", (channel) => {
    //TEST
    if (channel === testChannel) {
      //channelManager.send(testChannel, "chat", "Hello, AI!");
    }
  });

  channelManager.send("system", "join", testChannel);
});
