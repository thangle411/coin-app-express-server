const express = require("express");
const router = express.Router();
const twitterService = require("../services/twitter.service");
const openaiService = require("../services/openai.service");
const helper = require("../utils/helper.util");

router.get("/:ticker", async (req: any, res: any, next: any) => {
  try {
    const ticker = req.params.ticker;

    if (!ticker) {
      res.status(400).json({ error: 'Missing "ticker" query parameter' });
      return;
    }

    //fetch up to 100 recent tweets
    let x = 1;
    let currentCursor = "";
    let tweetsArray: any = [];
    while (x < 6) {
      const tweets = await twitterService.getTweetsForTicker(
        ticker,
        currentCursor
      );
      if (tweets.list.length) tweetsArray.push(...tweets.list);
      currentCursor = tweets.next.value;
      console.log("sleeping 1000m", currentCursor);
      await helper.sleep(1000);
      x++;
    }

    if (tweetsArray.length) {
      //filter similar strings using Levenshtein distance
      const uniqueTweets: any = [];
      const processedTexts = new Set();

      tweetsArray.forEach((tweet: any) => {
        let isSimilar = false;

        processedTexts.forEach((text: any) => {
          //remove hashtags that are less than 10 characters because some bots have the same message but with just different hashtags
          const distance = helper.levenshteinDistance(
            tweet.fullText.replace(/#\w{1,10}\b(?!#)/g, ""),
            text.replace(/#\w{1,10}\b(?!#)/g, "")
          );
          if (distance <= 5) {
            isSimilar = true;
            return;
          }
        });

        if (!isSimilar) {
          uniqueTweets.push(tweet);
          processedTexts.add(tweet.fullText);
        }
      });

      const stringForOpenAI = uniqueTweets.reduce(
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
      const returnTweets = uniqueTweets.map((tweet: any, index: number) => {
        return { ...tweet, sentiment: parsedIntoArray[index] };
      });
      res.json(returnTweets);
    }
  } catch (err) {
    console.error(`Error while getting tweets`, err);
    next(err);
  }
});

module.exports = router;
