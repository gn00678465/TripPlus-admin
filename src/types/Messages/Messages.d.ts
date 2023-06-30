declare namespace Messages {
  interface MessageSetting {
    sender: string;
    receiver: string;
    roomId: string;
    name: string;
  }

  interface Message extends Omit<MessageSetting, 'name'> {
    content: string;
  }
}
