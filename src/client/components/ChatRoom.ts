import { DomNode } from "@common-module/app";
import {
  ChatMessage,
  ChatMessageForm,
  ChatMessageList,
} from "@common-module/social-components";
import MessageManager from "../data-managers/MessageManager.js";

export default class ChatRoom extends DomNode {
  private messageList: ChatMessageList;
  private messageForm: ChatMessageForm;

  constructor() {
    super(".chat-room");
    this.append(
      this.messageList = new ChatMessageList(),
      this.messageForm = new ChatMessageForm(),
    );
  }

  public async joinChannel(channelId: string) {
    const messages = await MessageManager.joinChannel(channelId);
    const chatMessages: ChatMessage[] = messages.map((message, index) => ({
      id: index,
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
    }));
    this.messageList.setMessages(chatMessages);
  }
}
