/* eslint no-use-before-define: "warn" */
//const fs = require("fs");
// const chalk = require("chalk");
// const { config, ethers } = require("hardhat");
const fs = require('fs');
const ethers = require("ethers");
const pinataSdk = require("@pinata/sdk");
const { MAX_INTEGER } = require('ethereumjs-util');
const createVideoWallImage = require('./videoproc');
require('dotenv').config()

// const { config, ethers } = require("hardhat");


// const R = require("ramda");
//const ipfsAPI = require('ipfs-http-client');
//const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const delayMS = 1000 //sometimes xDAI needs a 6000ms break lol 😅
const contractAddress = '0xdf8984B23Fa2f78cE46ee299Bc5dF9Cfd1a76070';
const contractAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":false,"internalType":"bool","name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"CANNOT_TRANSFER_TO_ZERO_ADDRESS","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NOT_CURRENT_OWNER","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_approved","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_uri","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
process.argv.forEach(function (val, index) {
    console.log(index + ': ' + val);
  });

// async function createVideoWallImage(youTubeUrl) {
    
// }

async function mint(ipfsHash, account) {
    console.log(`mint hash ${ipfsHash} account ${account}`)

    // const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL, 1);
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
    // console.log('provider',provider);
    const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    // console.log('signer',signer);


    const contractInstance = await new ethers.Contract(contractAddress, contractAbi, signer);
    // console.log('contractInstance',contractInstance);

    const url = 'https://ipfs.io/ipfs/' + ipfsHash
    const metadata = {
        name: "Test 1",
        description: "This is my NFT test 1",
        image: url
    }
    //  'mint(address,uint256,string)'
    var options = { gasPrice: 11000000000, gasLimit: 85000, nonce: 45, value: 0 };
    // var options = { gasLimit: 85000 };

    const result = await contractInstance.mint(account, 18, JSON.stringify(metadata), options);
    // const result = await contractInstance.mint(account, 13, url, options);
    console.log('result',result);
    // ethers.Contract(contractAddress, contractAbi, signer)
    // .then(() => console.log('success'))
    // .catch((error) => {
    //     console.log('succnahess');
    //   console.error(error);
    //   process.exit(1);
    // });


}

const main = async () => {
    console.log('in main');

    console.log('PINATA_API_KEY: ', process.env.PINATA_API_KEY);
    console.log('PINATA_API_SECRET: ', process.env.PINATA_API_SECRET);

    const pinata = pinataSdk(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

    await pinata.testAuthentication();

    const account = process.argv[2];
    const videoid = process.argv[3];

    await createVideoWallImage(videoid, account);

    // await mint('QmTZhynH3hFEjb6irvLRudXaYXAo87mDPDeh6sMGnzLKfy',account);

    return;

    console.log('filename',filename);

    const readableStreamForFile = fs.createReadStream(filename);
    const options = {
        pinataMetadata: {
            name: "Distracted Boyfriend Mem",
            keyvalues: {
                customKey: 'customValue',
                customKey2: 'customValue2'
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    let result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log('result', result);

    mint(result.IpfsHash,account);



//   // ADDRESS TO MINT TO:
//   const toAddress = "0x3Ad52d2068e269E76de5CD7c881Dc617f79122c9"

//   console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

//   const { deployer } = await getNamedAccounts();
//   const yourCollectible = await ethers.getContract("YourCollectible", deployer);

//   const buffalo = {
//     "description": "It's actually a bison?",
//     "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
//     "image": "https://austingriffith.com/images/paintings/buffalo.jpg",
//     "name": "Buffalo",
//     "attributes": [
//        {
//          "trait_type": "BackgroundColor",
//          "value": "green"
//        },
//        {
//          "trait_type": "Eyes",
//          "value": "googly"
//        },
//        {
//          "trait_type": "Stamina",
//          "value": 42
//        }
//     ]
//   }
//   console.log("Uploading buffalo...")
//   const uploaded = await ipfs.add(JSON.stringify(buffalo))

//   console.log("Minting buffalo with IPFS hash ("+uploaded.path+")")
//   await yourCollectible.mintItem(toAddress,uploaded.path,{gasLimit:10000000})




  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */


  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */


  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
  console.log('done main');

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
