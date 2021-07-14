const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const realtime = require('./app/Socket/realtime');
const AppConfig = require('./app/defines/app_config');

app.use(bodyParser.json());
app.use(cors());

// connect db
mongoose.connect(`mongodb+srv://${AppConfig.database.username}:${AppConfig.database.password}@cluster0.mrjwz.gcp.mongodb.net/${AppConfig.database.databaseName}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected');
});

// routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user', require('./routes/user'));
app.use('/chat', require('./routes/chat'));

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// io
const io = socketIO(server);
realtime(io);