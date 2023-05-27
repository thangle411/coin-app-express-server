const express = require("express");
require("dotenv").config();

//routes
const twitterRouter = require("./routes/twitter.route");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: any, res: any) => {
  res.json({ message: "we are live" });
});

app.use("/tweets", twitterRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
