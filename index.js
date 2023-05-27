const express = require('express');
require('dotenv').config();
const { Rettiwt } = require('rettiwt-api');
const rettiwt = new Rettiwt();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'we are live' });
});

app.get('/tweets/:ticker', async (req, res) => {
  const ticker = req.params.ticker; // Get the value of "ticker" query parameter

  if (!ticker) {
    res.status(400).json({ error: 'Missing "ticker" query parameter' });
    return;
  }

  const searchParams = {
    words: [ticker],
    hashtags: [ticker],
  };

  const response = await rettiwt.tweets.getTweets(searchParams, 20);
  console.log(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
