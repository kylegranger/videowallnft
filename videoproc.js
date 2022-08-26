const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
var ffprobe = require('ffprobe'),
    ffprobeStatic = require('ffprobe-static');
const BigNumber = require('bignumber.js');

const NUM_CAPTURE_FRAMES = 9;

async function download(videoid, username) {
    console.log('download',videoid);
    let videourl = 'https://www.youtube.com/watch?v=' + videoid
    // let filepath = './assets/' + username + '.mp4';
    // let filepath = 'v-' + username + '.mp4';
    let filepath = 'video.mp4';
    console.log('videourl',videourl);
    console.log('filepath',filepath);
    // ytdl(videourl)
    // .pipe(fs.createWriteStream(filepath));
    // console.log('done');
    let length = 0;

    // ytdl(videourl)
    // .pipe(fs.createWriteStream(filepath))
    // .on("finish", () => {
    //     console.log("\nFinished!");
    //     return;
    //     // rl.close();
    //     // process.exit();
    // });



    const prom = new Promise(function (resolve) {
        let video = ytdl(videourl, { filter: format => format.container === 'mp4' });
        let vpipe = video.pipe(fs.createWriteStream(filepath));

        video.on('progress', function (chunkLength, downloaded, total) {
          const floatDownloaded = downloaded / total;
          console.log(`${filepath} - Download progress: ${parseFloat(floatDownloaded*100).toFixed(2)} %`);
        });

        video.on('error', function (err) {
          console.log("\nThere was an error downloading.\n");
          throw err;
        });

        video.on('end', function () {
          console.log(`\nFinished downloading: ${filepath}\n`);
        });

        video.on('info', function(data){
          console.log(data.length_seconds);
          length = data.length_seconds;
        });

        vpipe.on('finish', function () {
          console.log(`Finished writing ${filepath} to disk`);
          resolve();
        });
      });

    return prom

}

async function getVideoInfo(videofile) {
    console.log('getVideoInfo',videofile);

    let result = await ffprobe(videofile,{ path: ffprobeStatic.path });
    console.log('ffprobe result', result);
    let s = result.streams[0];
    let nframes = s.nb_frames;
    let duration = s.duration;

    return { nframes, duration };
}

function getNineFrameNumbers(nframes, account) {
    let frames = new Array();
    console.log('account:', account);
    for (let i = 0; i < NUM_CAPTURE_FRAMES; i++) {
        let section = account.substring(2 + i*4, 8 + i*4).toLowerCase();
        let y = new BigNumber('0x' + section);
        // 24-bit resolution
        let part = y.toNumber() / (256*256*256);
        let frameno = Math.floor(nframes * part)
        console.log(`section ${section} maps to frame ${frameno}, part ${part} of ${nframes} frames`);
        frames.push(frameno)
    }
    return frames;
}

async function createVideoWallImage(videoid, account) {
    const username = account.substring(0,10);
    console.log('createVideoWallImage:',videoid, username);
    // await download(videoid, username);
    const { nframes, duration } = await getVideoInfo('./video.mp4');
    console.log('nframes:', nframes);
    console.log('duration:', duration);
    let framerate = nframes / duration;
    console.log('derived framerate:', framerate);

    let frames = getNineFrameNumbers(nframes, account);
    // await extractFrames(username,frames);
    // let imagefile = await compositeFrames(username)
    // return imagefile;

}
module.exports = createVideoWallImage;