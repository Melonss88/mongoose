const MintModel = require('../models/Mint');
const axios = require('axios');

let contract;

function setContractInstance(contractInstance) {
    contract = contractInstance;
}

async function fetchDataAndSaveNew(to, tokenId, uri) {
    try {
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
            console.log(`Token ID ${tokenId} already exists. If this happens, it’s an issue. Please check!!!`);
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

exports.initializeContract = (contractInstance) => {
    setContractInstance(contractInstance);
    contract.on("mintEvent", async (to, tokenId, uri) => {
        console.log('Listening for mintEvent...');
        await fetchDataAndSaveNew(to, tokenId, uri);
    });
};

exports.getMintRecords = async (req,res) => {
    const filters = req.body || {};
    let query = {};

    if (typeof filters === 'object' && filters !== null) {
        Object.keys(filters).forEach((key) => {
            if (filters[key] && filters[key] !== 'all') {
                if (key === 'price' && Array.isArray(filters[key])) {
                    const [minPrice, maxPrice] = filters[key];

                    if (minPrice !== "" && maxPrice !== "") {
                        query['price'] = {
                            $gte: parseFloat(minPrice),
                            $lte: parseFloat(maxPrice)
                        };
                    }
                } else if (key === 'accessories') {
					if (filters[key] === 'yes') {
						query['accessories'] = { $ne: 'no' }; 
					} else if (filters[key] === 'no') {
						query['accessories'] = 'no'; 
					}
				} else {
					query[key] = filters[key];
				}
            }
        });
    }

    try {
        const records = await MintModel.find(query);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: '获取 mint 记录时出错' });
    }
}
