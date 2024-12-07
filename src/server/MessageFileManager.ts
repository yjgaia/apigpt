import { FileUtils } from "@common-module/server";

interface Message {
  sender: string;
  content: string;
}

class MessageFileManager {
  public async readChannelMessages(channel: string): Promise<Message[]> {
    const content = await FileUtils.readText(`./messages/${channel}.json`);
    return JSON.parse(content);
  }

  public async writeChannelMessages(channel: string, messages: Message[]) {
    await FileUtils.write(
      `./messages/${channel}.json`,
      JSON.stringify(messages),
    );
  }
}

export default new MessageFileManager();
