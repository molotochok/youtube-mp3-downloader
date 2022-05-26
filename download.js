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

const download = async (videoId) => {
  const start = Date.now();

  const info = await ytdl.getInfo(buildUrl(videoId));
  console.log(`Started downloading: ${info.videoDetails.title}\n`);

  const stream = ytdl.downloadFromInfo(info, {
      quality: "highestaudio", 
      filter: "audioonly"
  });

  ffmpeg(stream)
    .audioBitrate(512)
    .save(`./${FOLDER}/${info.videoDetails.title}.mp3`)
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
    });
};

const args = parseArguments();
download(args.videoId);