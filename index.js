const urlLib = require("url");
const https = require("https");
const ytdl = require("ytdl-core");
const axios = require("axios");

const cheerio = require("cheerio");
const express = require("express");
const request = require("request");

const app = express();

const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/instagram", (req, res) => {
  const url = req.query.url;
  res.header(
      "Content-Disposition",
      'attachment; filename="video' + Date.now() + '.mp4"'
    );
    request(url).pipe(res);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/insta", (req, res) => {
  res.sendFile(__dirname + "/public/instagram.html");
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

const getVideo = async (url) => {
  // calls axios to go to the page and stores the result in the html variable
  const html = await axios.get(url);
  // calls cheerio to process the html received
  const $ = cheerio.load(html.data);
  // searches the html for the videoString
  const videoString = $("meta[property='og:video']").attr("content");
  // returns the videoString
  return videoString;
};
app.post("/instagram", async (request, response) => {
  console.log("request coming in...");

  try {
    // call the getVideo function, wait for videoString and store it
    // in the videoLink variable
    const videoLink = await getVideo(request.body.url);
    // if we get a videoLink, send the videoLink back to the user
    if (videoLink !== undefined) {
      response.json({ downloadLink: videoLink });
    } else {
      // if the videoLink is invalid, send a JSON response back to the user
      response.json({ error: "The link you have entered is invalid. " });
    }
  } catch (err) {
    // handle any issues with invalid links
    response.json({
      error: "There is a problem with the link you have provided.",
    });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
