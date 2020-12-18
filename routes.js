const express = require('express');
const csv = require('csv-parser');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/upload', async (req, res, next) => {
  const path = "./upload/" + Date.now() + ".csv";

  process.env.status = "1";
  console.log(process.pid + " is handling this upload request");

  fs.open(path, 'wx', (err, fd) => {
    if(err) throw err;
    console.log("Writing began!");
    let num = 0;

    req.pipe(csv()).on('data', async row => {
      let crow = "";
      Object.values(row).forEach(val => crow += "\"" + val + "\",");
      crow += "\r\n";
      while(process.env.status === "0") {
        setTimeout(() => console.log("waiting !!!"), 1000);
      }
      fs.appendFile(fd, crow, err => {
        if(err) throw err;
        else{
          num++;
          console.log(num + " rows uploaded!");
        }
      });
    });

    req.on('end', () => {
      fs.close(fd, (err) => {
        if(err) console.log("error closing file!");
        else console.log("File closed successfully");
      });
      console.log("Data written successfully!");
      res.status(200).json({msg: "Uploaded!"});
    });

    req.on('error', err => {
      fs.close(fd, (err) => {
        if(err) console.log("error closing file!");
        else console.log("File closed successfully");
      });
      console.log("There was some error!");
      res.status(300).json({msg: "Error!"});
    });
  });
});

router.get('/handle', (req, res, next) => {
  console.log(process.pid + " is handling this control request");
  if(process.env.status === "1"){
    process.env.status = "0";
    console.log("paused................................");
    res.status(200).send("paused");
  } else {
    process.env.status = "1";
    console.log("resumed................................");
    res.status(200).send("resumed");
  }
});

router.get('/clear', (req, res, next) => {
  console.log(process.pid + " is handling this clear request");
  try{
    fs.readdir('upload', (err, files) => {
      if(err) throw err;
      for(const file of files){
        fs.unlink(path.join('upload', file), (err) => {
          if(err) throw err;
        });
      }
    });
    console.log("upload folder cleared!");
    res.status(200).send("files cleared!");
  } catch(err){
    console.log(err);
    console.log("Could not clear the upload folder!");
    res.status(312).send("there was some error");
  }
});

module.exports = router;
