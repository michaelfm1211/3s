const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const slowDown = require('express-slow-down');
const ExifTransformer = require('exif-be-gone');
const stream = require('stream');
const app = express();

const port = process.env.PORT || 33530;
const secret = process.env.SECRET || 'password';

const rateLimit = slowDown({
  windowMs: 10 * 60 * 1000,
  delayAfter: 5,
});

app.use(bodyParser.urlencoded({extended: true}));
// app.use(fileUpload({safeFileNames: true, useTempFiles: true}));
app.use(fileUpload({safeFileNames: true, createParentPath: true}));
app.use(express.static(__dirname + '/tmp', {
  setHeaders: (res, _path, _stat) => {
    res.contentType('image/png');
  },
}));

function bufferToStream(binary) {
  return new stream.Readable({
    read() {
      this.push(binary);
      this.push(null);
    }
  });
}

app.get('/', (_req, res) => {
  res.end('3s');
});

app.post('/', rateLimit, async (req, res) => {
  if (req.headers.authorization != 'Basic ' + secret) {
    return res.sendStatus(401);
  }

  try {
    const reader = bufferToStream(req.files.file.data);

    const filename = (Math.random() + 1).toString(36).substring(7) + 'a.png';
    const writer = fs.createWriteStream(path.join('./tmp', filename))

    reader.pipe(new ExifTransformer()).pipe(writer)
    res.send(`${req.protocol}://${req.headers.host}/${filename}`);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log('listening on port ' + port);
});
