const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

const { hide, extract } = require("./steganography.js");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/image-in-mp3", (req, res) => {
  res.render("image-in-mp3");
});

app.get("/mp3-in-image", (req, res) => {
  res.render("mp3-in-image");
});

app.get("/image-in-video", (req, res) => {
  res.render("image-in-video");
});

app.get("/video-in-image", (req, res) => {
  res.render("video-in-image");
});

app.post("/image-in-mp3/upload", (req, res) => {
  if (!req.files || !req.files.mp3 || !req.files.image) {
    return res.status(400).send("No files were uploaded.");
  }

  const mp3File = req.files.mp3;
  const imageFile = req.files.image;

  const mp3Data = mp3File.data;
  const imageData = imageFile.data;

  const newMP3Data = hide(mp3Data, imageData);

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="stego_music.mp3"'
  );
  res.setHeader("Content-Type", "audio/mpeg");
  res.send(newMP3Data);
});

app.post("/image-in-mp3/extract", (req, res) => {
  if (!req.files || !req.files.mp3) {
    return res.status(400).send("No MP3 file was uploaded.");
  }

  const mp3File = req.files.mp3;
  const mp3Data = mp3File.data;

  const imageData = extract(mp3Data);
  const base64Image = imageData.toString("base64");

  res.render("image", { image: base64Image });
});

app.post("/mp3-in-image/upload", (req, res) => {
  if (!req.files || !req.files.image || !req.files.mp3) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageFile = req.files.image;
  const mp3File = req.files.mp3;

  const imageData = imageFile.data;

  const mp3Data = mp3File.data;

  const newImageData = hide(imageData, mp3Data);

  res.setHeader("Content-Type", imageFile.mimetype);
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="stego_image.jpg"'
  );
  res.send(newImageData);
});

app.post("/mp3-in-image/extract", (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send("No image file was uploaded.");
  }
  const imageFile = req.files.image;
  const imageData = imageFile.data;

  const mp3Data = extract(imageData);
  const dateString = new Date().getTime().toString();

  const mp3Path = path.join(__dirname, "public", `extracted_${dateString}.mp3`);
  fs.writeFileSync(mp3Path, mp3Data);

  res.render("audio", { audio: `/public/extracted_${dateString}.mp3` });
});

app.post("/image-in-video/upload", (req, res) => {
  if (!req.files || !req.files.video || !req.files.image) {
    return res.status(400).send("No files were uploaded.");
  }

  const videoFile = req.files.video;
  const imageFile = req.files.image;

  const videoData = videoFile.data;
  const imageData = imageFile.data;

  const newVideoData = hide(videoData, imageData);

  res.setHeader("Content-Type", videoFile.mimetype);
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="stego_video.mp4"'
  );
  res.send(newVideoData);
});

app.post("/image-in-video/extract", (req, res) => {
  if (!req.files || !req.files.video) {
    return res.status(400).send("No video file was uploaded.");
  }

  const videoFile = req.files.video;
  const videoData = videoFile.data;

  const imageData = extract(videoData);
  const base64Image = imageData.toString("base64");

  res.render("image", { image: base64Image });
});

app.post("/video-in-image/upload", (req, res) => {
  if (!req.files || !req.files.image || !req.files.video) {
    return res.status(400).send("No files were uploaded.");
  }

  const imageFile = req.files.image;
  const videoFile = req.files.video;

  const imageData = imageFile.data;
  const videoData = videoFile.data;

  const newImageData = hide(imageData, videoData);

  res.setHeader("Content-Type", imageFile.mimetype);
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="stego_image.jpg"'
  );
  res.send(newImageData);
});

app.post("/video-in-image/extract", (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send("No image file was uploaded.");
  }

  const imageFile = req.files.image;
  const imageData = imageFile.data;

  const videoData = extract(imageData);
  const dateString = new Date().getTime().toString();

  const videoFilePath = path.join(
    __dirname,
    "public",
    `extracted_${dateString}.mp4`
  );
  fs.writeFileSync(videoFilePath, videoData);

  res.render("video", { video: `/public/extracted_${dateString}.mp4` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
