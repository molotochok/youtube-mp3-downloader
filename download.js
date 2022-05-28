const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const FOLDER = 'music';

const buildUrl = (videoId) => `https://www.youtube.com/watch?v=${videoId}`;

const parseArguments = () => {
  const args = process.argv.slice(2);
  return {
    videoId: args[0]
  };
};

const buildSaveFilePath = (fileName) => {
  fileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `./${FOLDER}/${fileName}.mp3`;
};

const download = async (videoId) => {
  const start = Date.now();

  const info = await ytdl.getInfo(buildUrl(videoId));
  console.log(`Started downloading: ${info.videoDetails.title}\n`);

  const stream = ytdl.downloadFromInfo(info, {
      quality: "highestaudio", 
      filter: "audioonly"
  });

  const saveFilePath = buildSaveFilePath(info.videoDetails.title);

  ffmpeg(stream)
    .audioBitrate(512)
    .save(saveFilePath)
    .on('codecData', function(data) {
      console.log("Audio file information:");
      console.log(data);
    })
    .on('error', function(err) {
      console.log('\nAn error occurred: ' + err.message);
    })
    .on('progress', p => {
      process.stdout.write(`Current speed: ${p.currentKbps} Kbps. Downloaded: ${p.targetSize} Kbs\r`);
    })
    .on('end', () => {
      console.log(`\n\nFinished downloading. Time spent: ${(Date.now() - start) / 1000}s`);
      console.log(`Music has been saved here: ${saveFilePath}`)
    });
};

const args = parseArguments();
download(args.videoId);