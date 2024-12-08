import { DomNode } from "@common-module/app";
import {
  ChatMessage,
  ChatMessageForm,
  ChatMessageList,
} from "@common-module/social-components";
import { v4 as uuidv4 } from "uuid";
import MessageManager from "../data-managers/MessageManager.js";

export default class ChatRoom extends DomNode {
  private messageList: ChatMessageList;

  constructor() {
    super(".chat-room");
    this.append(
      this.messageList = new ChatMessageList(),
      new ChatMessageForm((message) => this.sendMessage(message)),
    );
  }

  private sendMessage(message: string) {
    this.messageList.addMessage({
      id: uuidv4(),
      sender: "user",
      content: message,
      createdAt: new Date().toISOString(),
    });

    const newMessageId = uuidv4();

    this.messageList.addMessage({
      id: newMessageId,
      sender: "assistant",
      createdAt: new Date().toISOString(),
    });

    MessageManager.sendMessage(newMessageId, message);
  }

  public async joinChannel(channelId: string) {
    const messages = await MessageManager.joinChannel(channelId);
    const chatMessages: ChatMessage[] = messages.map((message) => ({
      id: uuidv4(),
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
    }));
    this.messageList.setMessages(chatMessages);
  }

  public addMessageChunk(targetMessageId: string, chunk: string) {
    this.messageList.addChunk(targetMessageId, chunk);
  }
}
