import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { app } from './api'

const PORT = process.env.PORT || 3000

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
})

httpServer.listen(PORT, () => {
    console.log(`server is listening to the ${PORT}`)
})

export { io }
