const PopularNFTsModel = require('../models/PopularNFTs')

exports.addPopularNFTs = async () => {
	const popularConfig = [
		{
		  id: "2",
		  name:'Ducklon',
		  website: "Metanebula",
		  price: "0.0001",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular1.png'
		},
		{
		  id: "21348",
		  name:'Lil Pudgy',
		  website: "Lil Pudgy",
		  price: "0.725",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular2.png'
		},
		{
		  id: "64443100",
		  name:'',
		  website: "Rune Stone",
		  price: "0.725",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular3.png'
		},
		{
		  id: "965",
		  name:'',
		  website: "PolyCat",
		  price: " 0.725",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular4.png'
		},
		{
		  id: "587",
		  name:'Quirkies',
		  website: "Quirkies Originals",
		  price: " 0.725",
		  imgURL:'https://harlequin-obliged-nightingale-746.mypinata.cloud/ipfs/QmVYj5m8rrSPM95Qy9mB2BLSAbCC4YZCNW9PqRrbzvTVyx/popular5.png'
		}
	  ];
	try {
		for (let i = 0; i < popularConfig.length; i++) {
			const config = new PopularNFTsModel({
			  id: popularConfig[i].id,  
			  name: popularConfig[i].name,
			  price: popularConfig[i].price,
			  imgURL: popularConfig[i].imgURL,
			  website:popularConfig[i].website
			});
	  
			await config.save();
		}
		console.log('add popularConfig success:', );
	}
	catch(error) {
		console.error('add popularConfig error:', error);
	}
}

exports.getPopularNFTs = async (req, res) => {
    try {
        const records = await PopularNFTsModel.find();
	    res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching PopularNFTs' });
    }
};