"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
let readyPlayerCount = 0;
const pong = server_1.io.of('/pong'); // Namespace
pong.on('connection', (socket) => {
    let room;
    console.log('A player is connected', socket.id);
    socket.on('ready', () => {
        room = 'room' + Math.floor(readyPlayerCount / 2);
        socket.join(room);
        console.log('Player ready', socket.id, room);
        readyPlayerCount++;
        if (readyPlayerCount % 2 === 0) {
            pong.in(room).emit('startGame', socket.id);
        }
    });
    socket.on('paddleMove', (paddleData) => {
        socket.to(room).emit('paddleMove', paddleData);
    });
    socket.on('ballMove', (ballData) => {
        socket.to(room).emit('ballMove', ballData);
    });
    socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);
        socket.leave(room);
    });
});
