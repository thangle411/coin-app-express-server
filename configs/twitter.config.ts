const { AccountService, Rettiwt } = require("rettiwt-api");
let rettiwt = new Rettiwt();
const accountService = new AccountService();

module.exports = async function () {
  const { kdt, twid, ct0, auth_token } = await accountService.login(
    process.env.TWITTER_EMAIL,
    process.env.TWITTER_USERNAME,
    process.env.TWITTER_PASSWORD
  );

  const rettiwt = new Rettiwt({
    auth_token,
    ct0,
    kdt,
    twid,
  });
  return rettiwt;
};
