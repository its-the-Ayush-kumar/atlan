const express = require('express');
const csv = require('csv-parser');
const router = express.Router();
const fs = require('fs');

router.post('/upload', async (req, res, next) => {
  const path = "./upload/" + Date.now() + ".csv";

  process.env.status = "1";

  fs.open(path, 'wx', (err, fd) => {
    if(err) throw err;
    console.log("Writing began!");
    let num = 0;

    req.pipe(csv()).on('data', async row => {
      let crow = "";
      Object.values(row).forEach(val => crow += "\"" + val + "\",");
      crow += "\r\n";
      if(process.env.status === "1"){
        fs.appendFile(fd, crow, err => {
          if(err) throw err;
          else{
            num++;
            if(num % 10000 === 0) console.log(num + " rows uploaded!");
          }
        });
      } else {
        console.log("paused!");
        setTimeout(() => {
          process.env.status = "1";
        }, 10000);
        console.log("resumed!");
      }
    });

    req.on('end', () => {
      fs.close(fd, (err) => console.log("Error closing file!"));
      console.log("Data written successfully!");
      res.status(200).json({msg: "Uploaded!"});
    });

    req.on('error', err => {
      fs.close(fd, (err) => console.log("Error closing file!"));
      console.log("There was some error!");
      res.status(300).json({msg: "Error!"});
    });
  });
});

router.post('/handle', (req, res, next) => {
  console.log("paused................................");
  process.env.status = "0";
  res.status(200).send("paused");
});

module.exports = router;
