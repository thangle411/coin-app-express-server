const express = require("express");
const router = express.Router();
const twitterService = require("../services/twitter.service");
const openaiService = require("../services/openai.service");

router.get("/:ticker", async (req: any, res: any) => {
  const ticker = req.params.ticker;

  if (!ticker) {
    res.status(400).json({ error: 'Missing "ticker" query parameter' });
    return;
  }

  const tweets = await twitterService.getTweetsForTicker(ticker);
  if (tweets) {
    const stringForOpenAI = tweets.list.reduce(
      (acc: string, current: any, index: number) => {
        return acc + `\n${index}. \"${current.fullText}\"`;
      },
      ""
    );
    const sentiments = await openaiService.analyzeSentiment(stringForOpenAI);
    const parsedIntoArray = sentiments
      .split("\n")
      .filter((str: string) => str.trim() !== "")
      .map((str: string) => str.replace(/^\d+\.\s*/, ""));

    const returnTweets = tweets.list.map((tweet: any, index: number) => {
      return { ...tweet, sentiment: parsedIntoArray[index] };
    });
    res.json(returnTweets);
  }
});

module.exports = router;
