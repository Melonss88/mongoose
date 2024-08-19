const filterConfigModel = require('../models/Filter')

exports.addFilterConfig = async () => {
	const filterConfig = [
		{
			name:'name',
			items:['all','ducklon','sailor','miku']
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
			items:['','']
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

exports.getFilterConfig = async (req, res) => {
    try {
        const records = await filterConfigModel.find();
	    res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching filter' });
    }
};