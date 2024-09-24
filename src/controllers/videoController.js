const path = require("path");
const fs = require("fs");

exports.enviarVideo = (req, res) => {
  const videoPath = path.join(__dirname, "../videos/tutorial.mp4");
  res.setHeader("Content-Type", "video/mp4");

  const videoStream = fs.createReadStream(videoPath);
  videoStream.pipe(res);
};
