"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const api_1 = require("./api");
const PORT = process.env.PORT || 3000;
const httpServer = (0, node_http_1.createServer)(api_1.app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
exports.io = io;
httpServer.listen(PORT, () => {
    console.log(`server is listening to the ${PORT}`);
});
