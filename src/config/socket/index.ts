import { io, SocketOptions, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  message: (arg: Messages.Message) => void;
}

interface ClientToServerEvents {
  joinRoom: (id: string) => void;
  message: (arg: Messages.Message) => void;
  leaveRoom: (id: string) => void;
}

export const createSocket = (options?: SocketOptions) => {
  return io(process.env.BASE_API_URL as string, {
    transports: ['websocket'],
    ...options
  });
};
export type { Socket, ServerToClientEvents, ClientToServerEvents };
