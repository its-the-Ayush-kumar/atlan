const cluster = require('cluster');
const http = require('http');
const port = process.env.PORT || 3000;

if(cluster.isMaster){
  cluster.fork(); // for uploading
  cluster.fork(); // for controlling

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("respawning !!!");
    cluster.fork();
  });
} else {
  const server = http.createServer(require('./app'));

  server.listen(port, () => { console.log(`Worker ${process.pid} is listening at port ${port}`); } );
}
