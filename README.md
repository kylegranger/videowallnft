# Video Wall NFT
# Test Branch
# Yet another change
# The third change

This node app demonstrates the minting of NFTs on the Polygon test network, Mumbai.

Given a YouTube video url, e.g. the James Bond trailer for No Time To Die, https://www.youtube.com/watch?v=BIhNsAtPbPI, the app extracts nine frames from the video. The frames chosen are deterministically based on the account number.  

Starting with the most significant byte in the account number for each image, I use the first three bytes to determine the position of the first frame.  The 24-bit number gets normalized to 0..1, and then the frame number is derived based on that value and the total number of frames. We shift to the right by 2 bytes for the next frame and repeat the process.  As an example, nine frame numbers are shown here, using the account number below and a video duration of 3720 frames.
```
nframes: 3720
duration: 155.155000
derived framerate: 23.976023976023974
account: 0x6DAf5c3818fA712A116647D2209F8523D7D730D1
section 6daf5c maps to frame 1593, part 0.42845702171325684 of 3720 frames
section 5c3818 maps to frame 1340, part 0.3602309226989746 of 3720 frames
section 18fa71 maps to frame 362, part 0.09757143259048462 of 3720 frames
section 712a11 maps to frame 1644, part 0.4420481324195862 of 3720 frames
section 116647 maps to frame 252, part 0.06796687841415405 of 3720 frames
section 47d220 maps to frame 1043, part 0.2805500030517578 of 3720 frames
section 209f85 maps to frame 474, part 0.12743407487869263 of 3720 frames
section 8523d7 maps to frame 1934, part 0.5200781226158142 of 3720 frames
section d7d730 maps to frame 3136, part 0.8431272506713867 of 3720 frames
```
Note: normalizing is performed by dividing by 2^^24 and not (2^^24 - 1).  This ensures that the value 1.0 never comes up, and in this example, the frame numbers run from 0 to 3719.

The individual frames are then composited into one image, arranged in a grid, 3x3.  That image gets saved as a jpeg, and uploaded to the IPFS via the Pinata SDK.  A url is generated and attached to the metadata for the mint call.

## Running videowall

If not done already, install the npm libraries
```
npm i
```

You will also need to have installed two command line utilities:  ffmpeg and imagemagick (for the convert call).

At the moment, there is no web front end, so the account, video ID, and description are passed in as command line arguments.  The YouTube video ID is the 11-char string that follows `https://www.youtube.com/watch?v=` in the url. 

```
node videowall 0x6DAf5c3818fA712A116647D2209F8523D7D730D1 BIhNsAtPbPI 'My James Bond Trailer NFT'
```


<test-notify-string>



