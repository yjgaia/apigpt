import { MessageChannelManager } from "@common-module/ts";
import OpenAI from "openai";
import Message from "../data/Message.js";
import MessageManager from "./MessageManager.js";

export default class ChatClient {
  private currentChannel: string | undefined;

  constructor(
    private openAIClient: OpenAI,
    private channelManager: MessageChannelManager<{
      join: (channel: string) => Promise<Message[]>;
      chat: (targetMessageId: string, message: string) => void;
    }>,
  ) {
    channelManager.on(
      "system",
      "join",
      (channel) => this.handleChannelJoin(channel),
    );
  }

  private async handleChannelJoin(channel: string): Promise<Message[]> {
    if (this.currentChannel) {
      this.channelManager.off(this.currentChannel, "chat");
    }
    this.currentChannel = channel;

    this.channelManager.on(
      channel,
      "chat",
      async (targetMessageId: string, message: string) =>
        await this.handleChatMessage(channel, targetMessageId, message),
    );

    this.channelManager.send("system", "joined", channel);
    return await MessageManager.readMessages(channel);
  }

  private async handleChatMessage(
    channel: string,
    targetMessageId: string,
    message: string,
  ): Promise<void> {
    const time = new Date();

    const stream = await this.openAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: await MessageManager.readMessagesForAIClient(channel),
      stream: true,
    });

    let assistantMessage = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      this.channelManager.send(
        channel,
        "messageChunk",
        targetMessageId,
        content,
      );
      assistantMessage += content;
    }

    await this.saveMessages(
      channel,
      message,
      assistantMessage,
      time,
      new Date(),
    );
  }

  private async saveMessages(
    channel: string,
    userMessage: string,
    assistantMessage: string,
    userMessageTime: Date,
    assistantMessageTime: Date,
  ): Promise<void> {
    await MessageManager.appendMessages(channel, [{
      sender: "user",
      content: userMessage,
      createdAt: userMessageTime.toISOString(),
    }, {
      sender: "assistant",
      content: assistantMessage,
      createdAt: assistantMessageTime.toISOString(),
    }]);
  }
}
