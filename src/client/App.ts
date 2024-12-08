import { BodyNode, el, Router, View } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { v4 as uuidv4 } from "uuid";
import ChannelList from "./components/ChannelList.js";
import ChatRoom from "./components/ChatRoom.js";
import ChannelManager from "./data-managers/ChannelManager.js";
import MessageManager from "./data-managers/MessageManager.js";

export default class App extends View {
  private channelList: ChannelList;
  private chatRoom: ChatRoom;

  constructor() {
    super();

    BodyNode.append(
      this.container = el(
        "#app",
        el(
          ".channel-list-container",
          new Button({
            type: ButtonType.Contained,
            title: "New Channel",
            onClick: () => Router.go(`/${uuidv4()}`),
          }),
          this.channelList = new ChannelList(),
        ),
        this.chatRoom = new ChatRoom(),
      ),
    );

    this.loadChannels();

    MessageManager.on("messageChunk", (targetMessageId, chunk) => {
      this.chatRoom.addMessageChunk(targetMessageId, chunk);
    });
  }

  private async loadChannels() {
    const channels = await ChannelManager.getAllChannels();
    for (const channel of channels) {
      this.channelList.addChannel(channel.id);
    }
  }

  public changeData(data: { channel?: string }): void {
    if (!data.channel) {
      Router.go(`/${uuidv4()}`);
    } else {
      this.chatRoom.joinChannel(data.channel);
    }
  }
}
