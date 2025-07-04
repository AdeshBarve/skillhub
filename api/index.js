const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorController } = require('./controllers/errorController');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(errorController);
connectDB(); // Connect to MongoDB

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
