const MintModel = require('../models/Mint')

exports.getNFTDetails = async (req, res) => {
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
};