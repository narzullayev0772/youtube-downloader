const express = require("express");
const app = express();
const urlLib = require("url");
const https = require("https");
const ytdl = require("ytdl-core");
const cors = require("cors");
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require("fs");
const { default: axios } = require("axios");
const cheerio = require("cheerio");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
var URL;
app.post("/", (req, res) => {
  URL = req.body.url;
  if (ytdl.validateURL(URL)) {
    ytdl
      .getInfo(URL)
      .then((result) =>
        res.json({
          name: result.videoDetails.title,
          photo: result.videoDetails.thumbnails[0].url,
        })
      )
      .catch(() => {
        res.json({ name: "Error time" });
      });
  } else {
    res.json({ name: "hech narsa topilmadi", photo: null });
  }
});

app.get("/down", (req, res) => {
  if (ytdl.validateURL(URL)) {
    res.header(
      "Content-Disposition",
      'attachment; filename="video' + Date.now() + '.mp4"'
    );
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
      .getBasicInfo(URL)
      .then((res) => (size = res.formats.map((e) => e.contentLength)[0]))
      .then(() => {
        res.set({
          "Content-Length": size,
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

app.get("/instagram", (req, res) => {
  URL = req.query.url;
  axios.get(URL).then((response) => {
    const $ = cheerio.load(response.data);
    const img = $('meta[ property="og:image"]').attr("content");
    const title = $('meta[ property="og:title"]').attr("content");
    const video = $('meta[ property="og:video"]').attr("content");
    res.json({
      img,
      title,
      video,
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
