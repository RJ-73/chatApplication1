const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a specific room
    socket.on('join room', ({ username, room }) => {
        socket.join(room);
        console.log(`${username} joined room ${room}`);

        // Notify the room of the new user
        socket.to(room).emit('chat message', {
            username: 'System',
            message: `${username} has joined the room.`,
        });
    });

    // Handle chat messages in a specific room
    socket.on('chat message', ({ username, room, message }) => {
        io.to(room).emit('chat message', { username, message });
    });

    // Notify the room when a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
