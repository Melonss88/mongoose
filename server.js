require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const { ethers } = require("ethers");
const axios = require('axios');
const MintModel = require('./models/Mint');
const TransferModel = require('./models/TransferRecord');
const BannerConfigModel = require('./models/BannerConfig')
const PopularNFTsModel = require('./models/PopularNFTs')
const filterConfigModel = require('./models/Filter')

const app = express();
const port = 4000;
// 解析 JSON 请求体
app.use(express.json());
//跨域
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Load the contract ABI and address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ERC721EnumerableForbiddenBatchMint",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "ERC721OutOfBoundsIndex",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "mintEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "nftTransferEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "buy",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "nftTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "safeMint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const contractAddress = '0x6071B8Ae9af496B67A14e0911e37c6b122a0bb2a';
const nodeProvider = "http://127.0.0.1:8545"; //本地链
//rpc
const customHttpProvider = new ethers.providers.JsonRpcProvider(nodeProvider);
//实例合约
const contract = new ethers.Contract(
	contractAddress,
	contractABI,
	customHttpProvider
);

//listen
async function fetchDataAndSave(to, tokenId, uri) {
	try {
	  const response = await axios.get(uri);
	  const jsonData = response.data;
  
	  const mint = new MintModel({
		to,
		tokenId,
		uri,
		timestamp: new Date(),
		name: jsonData.name,
		imageURL: jsonData.imageURL,
		color: jsonData.color,
		gender: jsonData.gender,
		rarity: jsonData.rarity,
		price: jsonData.price,
		accessories: jsonData.accessories
	  });
  
	  // 保存数据
	  await mint.save();
  
	  console.log('Mint saved in MongoDB Success!');
	} catch (error) {
	  console.error('Error saving mint:', error);
	}
}

async function fetchDataAndSaveNew(to, tokenId, uri) {
    try {
		console.log('uri',uri)
        const response = await axios.get(uri);
        const jsonDataList = response.data;
        const tokenIdNum = Number(tokenId);
        const jsonData = jsonDataList[tokenIdNum];

        if (!jsonData) {
            console.log(`No data found for Token ID ${tokenId}. Skipping...`);
            return;
        }
        const existingMint = await MintModel.findOne({ tokenId: tokenIdNum });
        if (existingMint) {
            console.log(`Token ID ${tokenId} already exists. 如果出现这个情况，就是出问题了，请注意！！！`);
            return; 
        }

        const mint = new MintModel({
            to,
            tokenId: tokenIdNum, 
            uri,
            timestamp: new Date(),
            name: jsonData.name,
            imageURL: jsonData.imageURL,
            color: jsonData.color,
            gender: jsonData.gender,
            rarity: jsonData.rarity,
            price: jsonData.price,
            accessories: jsonData.accessories
        });

        await mint.save();
        console.log(`Mint with Token ID ${tokenId} saved in MongoDB!`);
    } catch (error) {
        console.error('Error saving mint:', error);
    }
}
// //监听mint事件，增
contract.on("mintEvent", async (to, tokenId, uri) => {
    console.log('listen mintEvent to~');
	// fetchDataAndSave(to, tokenId, uri);
	await fetchDataAndSaveNew(to, tokenId, uri);
});

// 监听nftTransferEvent事件
contract.on("nftTransferEvent", async (from, to, tokenId, price) => {
	console.log('监听nftTransferEvent', from, to, tokenId, price);
	try {
	  const newTransfer = new TransferModel({
		from,
		to,
		tokenId,
		price: ethers.utils.formatUnits(price),
		timestamp: new Date(),
	  });
	  await newTransfer.save();
	  console.log('Transfer saved to MongoDB success~!');
  
	  // 获取新的URI
	  const mintRecord = await MintModel.findOne({ tokenId });
	  if (mintRecord) {
		const response = await axios.get(mintRecord.uri);
		const jsonData = response.data;
  
		// 更新mints记录
		const updatedMintRecord = await MintModel.findOneAndUpdate(
		  { tokenId },
		  {
			to,
			name: jsonData.name,
			imageURL: jsonData.imageURL,
			color: jsonData.color,
			gender: jsonData.gender,
			rarity: jsonData.rarity,
			price: jsonData.price,
			accessories: jsonData.accessories,
			timestamp: new Date()
		  },
		  { new: true }
		);
  
		if (updatedMintRecord) {
		  console.log('Mint record updated to new address ！');
		} else {
		  console.log('Mint record not found for tokenId:', tokenId);
		}
	  } else {
		console.log('Mint record not found for tokenId:', tokenId);
	  }
	} catch (error) {
	  console.error('Error saving transfer:', error);
	}
});


//add
//banner/config数据
async function addBannerConfig () {
	const bannerConfig = [
		{
		  imgURL: 'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/banner1.png',
		  title: "Congratulations!",
		  text: "Melon, on passing your graduation project!"
		},
		{
		  imgURL: 'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/banner2.png',
		  title: "NodeMonkes",
		  text: "Leads NFT sales with over US$660K in a day"
		},
		{
		  imgURL: 'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/banner3.png',
		  title: "Kendu Chads",
		  text: "NFT marketplace transforms the digital art world"
		},
		{
		  imgURL: 'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/banner4.png',
		  title: "Solana’s",
		  text: "DogeZuki tops daily NFT market"
		}
	];
	try {
		for (let i = 0; i < bannerConfig.length; i++) {
			const config = new BannerConfigModel({
			  id: i,  
			  title: bannerConfig[i].title,
			  content: bannerConfig[i].text,
			  imgURL: bannerConfig[i].imgURL
			});
	  
			await config.save();
		}
		console.log('add bannerConfig success:', );
	}
	catch(error) {
		console.error('add bannerConfig error:', error);
	}
}
// addBannerConfig ()

// popular/nfts数据
async function addpPopularNFTs() {
	const popularConfig = [
		{
		  id: "0",
		  name: "ducklon",
		  price: "0.0005",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular1.png'
		},
		{
		  id: "1",
		  name: "ducklon",
		  price: "0.001",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular2.png'
		},
		{
		  id: "2",
		  name: "ducklon",
		  price: "0.0001",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular3.png'
		},
		{
		  id: "3",
		  name: "ducklon",
		  price: "0.0005",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular4.png'
		},
		{
		  id: "4",
		  name: "ducklon",
		  price: "0.005",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular5.png'
		}
	  ];
	try {
		for (let i = 0; i < popularConfig.length; i++) {
			const config = new PopularNFTsModel({
			  id: popularConfig[i].id,  
			  name: popularConfig[i].name,
			  price: popularConfig[i].price,
			  imgURL: popularConfig[i].imgURL
			});
	  
			await config.save();
		}
		console.log('add popularConfig success:', );
	}
	catch(error) {
		console.error('add popularConfig error:', error);
	}
}
// addpPopularNFTs()

// filter配置数据
async function addFilterConfig() {
	const filterConfig = [
		{
			name:'name',
			items:['all','ducklon','sailor']
		},
		{
			name:'gender',
			items:['all', 'male', 'female']
		},
		{
			name:'rarity',
			items:['all','1','2','3','4','5']
		},
		{
			name:'color',
			items:['all','green','blue','purple','golden','red']
		},
		{
			name:'accessories',
			items:['all','yes','no']
		},
		{
			name:'price',
			items:''
		}
	]

	try {
		for (let i = 0; i < filterConfig.length; i++) {
			const filter = new filterConfigModel({
				name: filterConfig[i].name,
				items: filterConfig[i].items
			});
	  
			await filter.save();
		}
		console.log('add addFilterConfig success!');
	}
	catch(error) {
		console.error('add addFilterConfig error:', error);
	}
}
// addFilterConfig()


//查
app.post('/mint/records', async (req, res) => {
    const filters = req.body || {};
    let query = {};

    if (typeof filters === 'object' && filters !== null) {
        Object.keys(filters).forEach((key) => {
            if (filters[key] && filters[key] !== 'all') {
                query[key] = filters[key];
            }
        });
    }

    try {
        const records = await MintModel.find(query);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: '获取 mint 记录时出错' });
    }
});

  
app.get('/transfer/records', async (req, res) => {
  const records = await TransferModel.find();
  res.json(records);
});
app.get('/nft/details/:tokenId', async (req, res) => {
	try {
	  const { tokenId } = req.params;
	  const record = await MintModel.findOne({ tokenId });
	  if (record) {
		res.json(record);
	  } else {
		console.log(`Record not found for tokenId: ${tokenId}`);
		res.status(404).json({ error: 'Record not found' });
	  }
	} catch (error) {
	  console.error('Error fetching NFT details:', error);
	  res.status(500).json({ error: 'Error fetching NFT details' });
	}
});
app.get('/banner/config', async (req, res) => {
	const records = await BannerConfigModel.find();
	res.json(records);
});
app.get('/popular/nfts', async (req, res) => {
	const records = await PopularNFTsModel.find();
	res.json(records);
});
app.get('/filter/config', async (req, res) => {
	const records = await filterConfigModel.find();
	res.json(records);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
