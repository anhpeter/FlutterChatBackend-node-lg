const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const axios = require('axios');
const realtime = require('./app/Socket/realtime');

app.use(bodyParser.json());
app.use(cors());

// connect db
mongoose.connect('mongodb+srv://webfullstack99:admin123456@cluster0.mrjwz.gcp.mongodb.net/flutter-chat?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected');

    // we're connected!
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/user', require('./routes/user'));
app.use('/chat', require('./routes/chat'));

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// io
const io = socketIO(server);
realtime(io);

function startKeepAlive() {
    setInterval(() => {
        axios
            .get("https://pa-chat-api.glitch.me")
            .then(response => {
                console.log("make alive");
                console.log("res", response.data.data);
            })
            .catch(error => {
                console.log("err", error.response.data);
            });
    }, 4 * 60 * 1000);
}