/* eslint no-use-before-define: "warn" */
//const fs = require("fs");
// const chalk = require("chalk");
// const { config, ethers } = require("hardhat");
const fs = require('fs');
const ethers = require("ethers");
const pinataSdk = require("@pinata/sdk");
const { MAX_INTEGER } = require('ethereumjs-util');
const { createVideoWallImage, doCommand } = require('./videoproc');
// const { syncBuiltinESMExports } = require('module');
require('dotenv').config()



const delayMS = 1000 //sometimes xDAI needs a 6000ms break lol 😅
// VideoWall3
const contractAddress = '0x09F23f230Faf42d54Ace7c70F367e5cFe8BF9BaD';
const contractAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"tokenURI","type":"string"}],"name":"mintItem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]';




process.argv.forEach(function (val, index) {
    console.log(index + ': ' + val);
  });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function mint(ipfsHash, account) {
    console.log(`mint hash ${ipfsHash} account ${account}`)

    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
    // console.log('provider',provider);
    const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    // console.log('signer',signer);
    const contractInstance = await new ethers.Contract(contractAddress, contractAbi, signer);
    //console.log('contractInstance',contractInstance);

    // var options = { gasPrice: 11000000000, gasLimit: 85000, nonce: 48, value: 0 };
    var options = { gasLimit: 885000 };

    const transaction = async () => {
        try {
            let tx = await contractInstance.mintItem(account, ipfsHash, options);
            await tx.wait()
        } catch (e) {
            console.log('error:',e);
        }
    }
    
    await transaction();
}

const main = async () => {
    console.log('in main');

    console.log('PINATA_API_KEY: ', process.env.PINATA_API_KEY);
    console.log('PINATA_API_SECRET: ', process.env.PINATA_API_SECRET);
    const pinata = pinataSdk(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
    await pinata.testAuthentication();

    const account = process.argv[2];
    const videoid = process.argv[3];
    const description = process.argv[4];

    const username = account.substring(0,10);
    filename = await createVideoWallImage(videoid, account, username);
    console.log('filename',filename);
    console.log('description',description);

    const readableStreamForFile = fs.createReadStream(filename);
    const options = {
        description
    };
    let result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log('result', result);
    doCommand(`rm assets/${username}*.png`)
    doCommand(`rm assets/${username}*.jpeg`)
    // doCommand(`rm assets/${username}*.mp4`)

    await mint(result.IpfsHash,account);// 

    console.log('done main');

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
