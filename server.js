import express from 'express';
const server = express();
import Watcher from 'watcher';
import 'dotenv/config';

// call the file watcher
const filePath = process.env.FILE_PATH;
const watcher = new Watcher(filePath);

const PORT = process.env.PORT || 6002;

server.get('/', (req, res, next) => {
  console.log('GET /');
  res.send('Acknowledge');
});

server.get('/start', (req, res, next) => {
  watcher.on('all', (event, targetPath, targetPathNext) => {
    console.log('Watcher event:', event);
    console.log('Target path:', targetPath);
    console.log('Target path next:', targetPathNext);
  });
  console.log('Called file watcher START.');
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
