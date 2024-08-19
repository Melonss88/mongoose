require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json()); // 解析 JSON 请求体
app.use(cors()); //跨域

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// 接口
const bannerRoute = require('./routes/bannerRoute');
app.use('/', bannerRoute);
const popularNFTsRoute = require('./routes/popularNFTsRoute');
app.use('/', popularNFTsRoute);
const filterRoute = require('./routes/filterRoute');
app.use('/', filterRoute);
const mintRoute = require('./routes/mintRoute');
app.use('/', mintRoute);
const transferRoute = require('./routes/transferRoute');
app.use('/', transferRoute);
const nftDetailsRoute = require('./routes/nftDetailsRoute');
app.use('/', nftDetailsRoute);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
