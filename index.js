const path = require('path');

const openCV = require('opencv4nodejs');
const wCap = new openCV.VideoCapture(0);

const express = require('express');
const videoApp = express();

const httpServer = require('http').Server(videoApp);

const socketio = require('socket.io')(httpServer);

const port = 8080;

//video settings
const height = 640; 
const width = 480;
const FPS = 30; // set the stream frames per second

wCap.set(openCV.CAP_PROP_FRAME_WIDTH, height);
wCap.set(openCV.CAP_PROP_FRAME_WIDTH, width);
wCap.set(openCV.CAP_PROP_FPS, FPS);

videoApp.use(express.static('public'));
videoApp.use('/socket', express.static('public'));

videoApp.get('/', (req, res) => {
    console.log('server running')
    res.sendFile(path.join(__dirname, 'index.html'));
})

setInterval(() => {
    const frameCap = wCap.read();
    const image = openCV.imencode('.jpg', frameCap).toString('base64');

    socketio.emit('image', image);
}, 1000 / FPS)

httpServer.listen(port);