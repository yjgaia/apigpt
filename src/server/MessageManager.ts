import Message from "../data/Message.js";
import MessageFileManager from "./MessageFileManager.js";

interface AIClientMessage {
  role: "user" | "assistant";
  content: string;
}

class MessageManager {
  private messages: Record<string, Message[]> = {};

  public async readMessages(channel: string): Promise<Message[]> {
    if (!this.messages[channel]) {
      this.messages[channel] = await MessageFileManager.readMessages(channel);
    }
    return this.messages[channel];
  }

  public async readMessagesForAIClient(
    channel: string,
  ): Promise<AIClientMessage[]> {
    const messages = await this.readMessages(channel);
    return messages.map((message) => ({
      role: message.sender,
      content: message.content,
    }));
  }

  public async appendMessages(channel: string, newMessages: Message[]) {
    if (!this.messages[channel]) {
      this.messages[channel] = await MessageFileManager.readMessages(channel);
    }
    this.messages[channel].push(...newMessages);
    await MessageFileManager.writeMessages(channel, this.messages[channel]);
  }
}

export default new MessageManager();
