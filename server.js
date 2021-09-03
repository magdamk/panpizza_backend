require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to DB'));
const User = require('./models/user');

// set up port
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

// add routes
const router = require('./routes/router.js');
app.use('/api', router);

// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));