const fs = require('fs');
const https = require('https');
// const express = require('express');
const WebSocket = require('ws');

const { handleSocket } = require('./socket');
const { initializeWorkers } = require('./worker');

const HTTPS_OPTIONS = Object.freeze({
  cert: fs.readFileSync('./ssl/fullchain.pem', 'utf8'),
  key: fs.readFileSync('./ssl/privkey.pem', 'utf8')
});

const httpsServer = https.createServer(HTTPS_OPTIONS);
// const app = express();

const wss = new WebSocket.Server(
  {
    maxPayload: 200000000,
    // noServer: true,
    server: httpsServer
  },
  () => console.log('WebSocket.Server started')
);

const noop = () => {};

function heartbeat() {
  this.isAlive = true;
}

(async () => {
  try {
    await initializeWorkers();

    httpsServer.listen(8883, () =>
      console.log('websocket SSL server running on port 8883')
    );

    // const server = app.listen(3000, () => {
    //   console.log('websocket SSL server running on port 3000');
    // });
    // console.log('__dirname', __dirname);
    // app.use(express.static(__dirname + '/../public/dist'));
    // server.on('upgrade', (request, socket, head) => {
    //   wsServer.handleUpgrade(request, socket, head, (socket) => {
    //     wsServer.emit('connection', socket, request);
    //   });
    // });
  } catch (error) {
    console.error('Failed to initialize workers [error:%o]', error);
  }
})();

wss.on('connection', (socket) => {
  socket.isAlive = true;
  socket.on('pong', heartbeat);

  // Decorate socket
  socket.broadcast = (message) => {
    for (const client of wss.clients) {
      //if (client !== socket && client.readyState === WebSocket.OPEN) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  };

  socket.emitToSocket = (socketId, message) => {
    const client = Array.from(wss.clients).find(
      (client) => client.id === socketId
    );

    if (!client) {
      console.error('Failed to find client with id %s', socketId);
      return;
    }

    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  };

  handleSocket(socket);
});
