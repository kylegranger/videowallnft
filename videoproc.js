
const BigNumber = require('bignumber.js');

const NUM_CAPTURE_FRAMES = 9;

async function download(videourl, username) {
}

async function getNumberOfFrames(username) {
    return 4032;
}

function getNineFrameNumbers(nframes, account) {
    console.log('getNineFrameNumbers');

    let frames = new Array();
    
    console.log('account:', account);
    console.log('nframes:', nframes);
    let m = new BigNumber('0xffff')
    for (let i = 0; i < NUM_CAPTURE_FRAMES; i++) {
        let section = account.substring(2 + i*4, 6 + i*4).toLowerCase();
        let y = new BigNumber('0x' + section);
        // part < 1.0
        let part = y.toNumber() / 65536;

        // console.log('section', section, y.toString(16))
        let frameno = Math.floor(nframes * part)
        // console.log('part', part);
        // console.log('frameno', frameno);
        console.log(`section ${section} gives us frameno ${frameno}, based on part ${part} of ${nframes} frames`);
        frames.push(frameno)
    }
    return frames;
}

async function createVideoWallImage(videourl, account) {
    const username = account.substring(0,10);
    console.log('createVideoWallImage:',videourl, username);
    await download(videourl, username);
    let nframes = await getNumberOfFrames(username);
    let frames = getNineFrameNumbers(nframes, account);
    console.log('frames size is ', frames.length)
    // await captureFrames(username,frames);
    // await resizeFrames(username);
    // let imagefile = await compositeFrames(username)
    // return imagefile;

}
module.exports = createVideoWallImage;