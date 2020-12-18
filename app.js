const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorisation');
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  return next();
});

app.use('/api', routes);

app.get('/', (req, res) => {
  return res.status(200).json({
    msg: "Server started!"
  });
});

// 404s
app.use((req, res, next) =>{
  return next(404);
});

// Error control

let errorList = {};

app.use((error, req, res, next) => {
  console.log(error);
  
  if(isNaN(error)){
    return res.status(500).json({
      error: error
    });
  } else {
    res.status(error).json({
      message: errorList[error]
    });
  }
});

module.exports = app;
