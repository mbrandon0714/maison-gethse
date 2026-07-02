const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

const input = path.join(__dirname, "..", "public", "video", "intro-film.mp4");
const output = path.join(__dirname, "..", "public", "video", "intro-film-compressed.mp4");

console.log("Compressing video...");
console.log("Input:", input);
console.log("Output:", output);

ffmpeg(input)
  .videoCodec("libx264")
  .addOption("-crf", "28")
  .addOption("-preset", "slow")
  .addOption("-movflags", "+faststart")
  .audioCodec("aac")
  .audioBitrate("128k")
  .size("1280x?")
  .aspect("16:9")
  .on("start", (cmd) => console.log("Running:", cmd))
  .on("progress", (p) => {
    if (p.percent) process.stdout.write(`\rProgress: ${p.percent.toFixed(1)}%`);
  })
  .on("end", () => {
    console.log("\nDone! Output:", output);
    const fs = require("fs");
    const stats = fs.statSync(output);
    console.log("Size:", (stats.size / 1024 / 1024).toFixed(1) + "MB");
  })
  .on("error", (err) => console.error("Error:", err.message))
  .save(output);
