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

  interface Project {
    creator: string;
    keyVision: string;
    title: string;
  }

  interface ChatRoom {
    customerId: string;
    message: Message[];
  }

  interface MessageList {
    project: Project;
    chatRooms: ChatRoom[];
  }
}
