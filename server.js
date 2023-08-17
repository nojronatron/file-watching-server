import express from 'express';
const server = express();
import Watcher from 'watcher';
import 'dotenv/config';

// call the file watcher
const filePath = process.env.FILE_PATH;
const watcherOptions = {
  debounce: 300,
  depth: 1,
  limit: 10,
  ignoreInitial: false,
  native: true,
  persistent: true,
  pollingInterval: 3000,
  pollingTimeout: 20000,
  recursive: false,
  renameDetection: false,
  renameTimeout: 1250,
};

var watcher = new Watcher();

const PORT = process.env.PORT || 6002;

server.get('/', (req, res, next) => {
  console.log('GET /');
  res.send('Acknowledge');
});

server.get('/start', (req, res, next) => {
  watcher = new Watcher(filePath, watcherOptions);
  console.log('Called file watcher START.');

  watcher.on('error', (err) => {
    console.error('Error:', err);
  });
  watcher.on('ready', () => {
    console.log('File watcher ready.');
  });
  watcher.on('close', () => {
    console.log('File watcher closed.');
  });
  watcher.on('add', (filePath) => {
    console.log('File added:', filePath);
    // todo: call function to process file
  });
  watcher.on('unlink', (filePath) => {
    console.log('File removed:', filePath);
    // todo: determine what to do when a file is removed (or renamed)
  });

  res.send('File watcher started.');
});

server.get('/stop', (req, res, next) => {
  console.log('Called file watcher STOP.');
  // call to stop file watcher
  watcher.close();
  res.send('File watcher stopped.');
});

server.use((err, req, res, next) => {
  console.error('Error:', err);
  if (res.headersSent) {
    console.error(
      'Headers already send, cannot respond to client with current error.'
    );
  } else {
    res.status(500).send('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
