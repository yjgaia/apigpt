import { WebSocketClient } from "@common-module/app";
import { EventContainer, MessageChannelManager } from "@common-module/ts";
import Config from "../../Config.js";
import Message from "../../data/Message.js";

const config = (window as any).config as Config;

class MessageManager extends EventContainer<{
  connected: () => void;
  messageChunk: (targetMessageId: string, chunk: string) => void;
}> {
  private client = new WebSocketClient(config.serverUrl);

  private _channelManager:
    | MessageChannelManager<{
      joined: (channel: string) => void;
      messageChunk: (targetMessageId: string, chunk: string) => void;
    }>
    | undefined;

  private get channelManager() {
    if (!this._channelManager) {
      throw new Error("Message channel manager not initialized");
    }
    return this._channelManager;
  }

  private set channelManager(channelManager) {
    this._channelManager = channelManager;
  }

  private joinedChannel: string | undefined;

  constructor() {
    super();
    this.client.on("connect", () => {
      this.initChannelManager();
      this.emit("connected");
    });
  }

  private initChannelManager() {
    this.channelManager = new MessageChannelManager(this.client);
    this.channelManager.on("system", "joined", (channel) => {
      if (this.joinedChannel) {
        this.channelManager.off(this.joinedChannel, "messageChunk");
      }
      this.joinedChannel = channel;
      this.channelManager.on(
        channel,
        "messageChunk",
        (targetMessageId, chunk) =>
          this.emit("messageChunk", targetMessageId, chunk),
      );
    });
  }

  public async joinChannel(channel: string): Promise<Message[]> {
    return await this.channelManager.request("system", "join", channel);
  }

  public sendMessage(targetMessageId: string, message: string) {
    if (!this.joinedChannel) throw new Error("Not in a channel");

    this.channelManager.send(
      this.joinedChannel,
      "chat",
      targetMessageId,
      message,
    );
  }
}

export default new MessageManager();
