import { io } from 'socket.io-client';

export const socket = io(process.env.BASE_API_URL as string);
