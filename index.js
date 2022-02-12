const express = require("express");
const app = express();
const urlLib = require("url");
const https = require("https");
const ytdl = require("ytdl-core");
const cors = require("cors");
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
var URL;
app.post("/", (req, res) => {
  URL = req.body.url;
  if (ytdl.validateURL(URL)) {
  ytdl
    .getInfo(URL)
    .then((result) => res.json({ name: result.videoDetails.title,
    photo:result.videoDetails.thumbnails[0].url })).catch(()=>{
      res.json({name:"Error time"})
    })
  }
  else{
    res.json({ name: "hech narsa topilmadi",
      photo:null })
  }
});

app.get("/down", (req, res) => {
  if (ytdl.validateURL(URL)) {
    res.header('Content-Disposition', 'attachment; filename="video'+Date.now()+'.mp4"');
    ytdl(URL, {
      format: "mp4",
    }).pipe(res);
  } else {
    res.json({ message: "Link Mavjud Emas" });
  }
});
app.get("/bot", (req, res) => {
  URL = req.query.url;
  var size;
  if (ytdl.validateURL(URL)) {
    const stream = ytdl(URL, { quality: "highest" });
    ytdl
      .getInfo(URL)
      .then((result) => {
        size = result.player_response.videoDetails.lengthSeconds;
        console.log(size);
      })
      .then(() => {
        res.set({
          "Content-Length": size * 1024 * 1024,
          "Content-Disposition":
            'attachment; filename="video' + Date.now() + '.mp4"',
        });
      })
      .then(() => {
        stream.pipe(res);
      });
  } else {
    res.json({ message: "Link Mavjud Emas" });
  }
});

const PORT = process.env.PORT || 8080
app.listen(PORT);
