const http = require('hhtp');
const port = process.env.PORT || 3000;
const app = require('./app');

const server = http.createServer(app);

server.listen(port);
