const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const cors = require("cors");
app.use(cors());
app.use(express.static(__dirname + "public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
var URL;
app.post("/", (req, res) => {
  URL = req.body.url;
  ytdl
    .getInfo(URL)
    .then((result) => res.json({ name: result.videoDetails.title,
    photo:result.videoDetails.thumbnails[0].url }));
});

let time = new Date();

app.get("/down", (req, res) => {
  if (ytdl.validateURL(URL)) {
    res.header(`Content-Disposition", 'attachment; filename="video_${time.getFullYear()}${time.getDay()}${time.getHours()}${time.getMinutes()}${time.getSeconds()}${time.getMilliseconds()}.mp4"`);
    ytdl(URL, {
      format: "mp4",
    }).pipe(res);
  } else {
    res.json({ message: "Link Mavjud Emas" });
  }
});
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log("http://localhost:8080/");
});
