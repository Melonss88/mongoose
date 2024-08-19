const BannerConfigModel = require('../models/BannerConfig')

exports.addBannerConfig = async (req, res) => {
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
};

// 获取 Banner 配置的控制器函数
exports.getBannerConfig = async (req, res) => {
    try {
        const records = await BannerConfigModel.find();
	    res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching banner config' });
    }
};