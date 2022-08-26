const fs = require('fs');
const ytdl = require('ytdl-core');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ffprobe = require('ffprobe'),
    ffprobeStatic = require('ffprobe-static');
const BigNumber = require('bignumber.js');

const NUM_CAPTURE_FRAMES = 9;

async function download(videoid, filepath) {
    console.log('download',videoid);
    let videourl = 'https://www.youtube.com/watch?v=' + videoid
    console.log('videourl',videourl);
    console.log('filepath',filepath);
    let length = 0;

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

async function extractFrame(videofile, username, frameno, index) {
    console.log('extractFrame', videofile, frameno)
    let command = `ffmpeg -i ${videofile} -vf "select=eq(n\\,${frameno})" -vframes 1 ./assets/${username}-${index}.png`
    try {
        const { stdout, stderr } = await exec(command);
            // console.log('stdout:', stdout);
            // console.log('stderr:', stderr);
        } catch (e) {
        console.error(e); 
    }
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

function getFrameNumbers(nframes, account) {
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
    const videofile = `./assets/${username}.mp4`;
    console.log('createVideoWallImage:',videoid, videofile);
    await download(videoid, videofile);
    const { nframes, duration } = await getVideoInfo(videofile);
    console.log('nframes:', nframes);
    console.log('duration:', duration);
    let framerate = nframes / duration;
    console.log('derived framerate:', framerate);

    let frames = getFrameNumbers(nframes, account);

    for (let i = 0; i < NUM_CAPTURE_FRAMES; i++) {
        await extractFrame(videofile,username,frames[i], i);
    }
    // let imagefile = await compositeFrames(username)
    // return imagefile;
}
module.exports = createVideoWallImage;