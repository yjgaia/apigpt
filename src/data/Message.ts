export default interface Message {
  sender: "user" | "assistant";
  content: string;
  createdAt: string;
}
