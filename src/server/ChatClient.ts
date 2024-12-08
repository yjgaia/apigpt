import { MessageChannelManager } from "@common-module/ts";
import OpenAI from "openai";
import Message from "../data/Message.js";
import MessageFileManager from "./MessageFileManager.js";

export default class ChatClient {
  constructor(
    openAIClient: OpenAI,
    channelManager: MessageChannelManager<{
      join: (channel: string) => Promise<Message[]>;
      chat: (targetMessageId: string, message: string) => void;
    }>,
  ) {
    let joinedChannel: string | undefined;

    channelManager.on("system", "join", async (channel) => {
      if (joinedChannel) channelManager.off(joinedChannel, "chat");
      joinedChannel = channel;

      channelManager.on(
        channel,
        "chat",
        async (targetMessageId: string, message: string) => {
          const time = new Date();

          const stream = await openAIClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }],
            stream: true,
          });

          let fullMessage = "";
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            channelManager.send(
              channel,
              "messageChunk",
              targetMessageId,
              content,
            );
            fullMessage += content;
          }

          await MessageFileManager.appendMessages(channel, [{
            sender: "user",
            content: message,
            createdAt: time.toISOString(),
          }, {
            sender: "assistant",
            content: fullMessage,
            createdAt: time.toISOString(),
          }]);
        },
      );

      channelManager.send("system", "joined", channel);

      return await MessageFileManager.readMessages(channel);
    });
  }
}
