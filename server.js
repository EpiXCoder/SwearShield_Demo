const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SwearShield } = require('swear-shield');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const filter = new SwearShield();

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('new-comment', (data) => {
        const cleanedComment = filter.sanitize(data.comment);
        io.emit('display-comment', { name: data.name, comment: cleanedComment });
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
