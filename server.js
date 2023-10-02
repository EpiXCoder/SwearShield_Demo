const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SwearShield } = require('swear-shield');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const filter = new SwearShield();

app.use(express.static('public'));
app.use(bodyParser.json()); 


io.on('connection', (socket) => {
    socket.on('new-comment', (data) => {
        const cleanedComment = filter.sanitize(data.comment);
        io.emit('display-comment', { name: data.name, comment: cleanedComment });
    });
});

app.post('/check-profanity', (req, res) => {
    const comment = req.body.comment;
    const hasProfanity = filter.isProfane(comment);
    res.json({ hasProfanity });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
