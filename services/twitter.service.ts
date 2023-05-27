const twitterConfigPromise = require("../configs/twitter.config");

let twitterConfig: any;
(async () => {
  twitterConfig = await twitterConfigPromise();
})();

async function getTweetsForTicker(ticker: string) {
  const searchParams = {
    words: ["$" + ticker],
    hashtags: [ticker],
  };

  const response = await twitterConfig.tweets.getTweets(searchParams, 20);
  if (response.list.length) {
    return response;
  }
  return;
}

module.exports = {
  getTweetsForTicker,
};
