# Video Wall NFT

This node app demonstrates the minting of NFTs on the Polygon test network, Mumbai.

Given a YouTube video url, e.g. the James Bond trailer for No Time To Die, https://www.youtube.com/watch?v=BIhNsAtPbPI, the app extracts nine frames from the video. The positions (e.g. SMPTE timecodes) are based on the account number.  Being 20 bytes, I take the upper 18 bytes, and for each image, I use two bytes (as uint16) to determine the frame number, based on duration or total number of frames.

The individual frames are then resized to 640x360 each (letterboxed/pillarboxed padding with black as appropriate), and then composited into one 1920x1080 image, arranged 3x3.

That image is then saved as a jpeg, and uploaded to the IPFS via the Pinata SDK.  A url is then generated and attached to the metadata for the mint call.
