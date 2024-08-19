const TransferModel = require('../models/TransferRecord');
const MintModel = require('../models/Mint');
const axios = require('axios');

let contract;

function setContractInstance(contractInstance) {
    contract = contractInstance;
}

async function nftTransferFn(from, to, tokenId, price) {
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
}

exports.initializeContract = (contractInstance) => {
    setContractInstance(contractInstance);
    contract.on("nftTransferEvent", async (from, to, tokenId, price) => {
        console.log('监听nftTransferEvent', from, to, tokenId, price);
        // await nftTransferFn(from, to, tokenId, price)
    });
};

exports.getTransferRecords = async (req,res) => {
    const records = await TransferModel.find();
    res.json(records);
}