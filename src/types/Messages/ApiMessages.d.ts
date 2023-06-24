declare namespace ApiMessages {
  interface Message {
    _id: string;
    content: string;
    sender: {
      _id: string;
      name: string;
      photo: string;
    };
    receiver: {
      _id: string;
      name: string;
      photo: string;
    };
    roomId: RoomId;
    createdAt: string;
    updatedAt: string;
  }

  interface RoomId {
    _id: string;
    participants: [string, string];
    projectCreator: string;
    createdAt: string;
    updatedAt: string;
    projectId: ProjectId;
  }

  interface ProjectId {
    _id: string;
    creator: string;
    title: string;
    progressRate: null;
    countDownDays: number;
    type: string;
    id: string;
  }

  interface MessageList {
    customerId: string;
    message: Message[];
  }
}
