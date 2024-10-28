import { io } from 'socket.io-client';

let socket;

export const setupSocketListeners = (onMessage) => {
    const socketUrl = 'wss://197.251.217.45:5000'; // Use 'wss://' for secure connection

    socket = io(socketUrl, {
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', (error) => {
        console.error('Connection Error:', error.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket server:', reason);
    });

    socket.on('message', (data) => {
        console.log('Received message:', data);
        onMessage(data);
    });

    socket.on('error', (error) => {
        console.error('Socket Error:', error);
    });
};
