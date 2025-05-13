const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/mydatabase';


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('🚀 Hello marooh from Node.js with MongoDB!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
