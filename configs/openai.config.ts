import { OpenAIApi as OpenAIApiType } from "openai";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET,
});
const openai: OpenAIApiType = new OpenAIApi(configuration);

module.exports = openai;
