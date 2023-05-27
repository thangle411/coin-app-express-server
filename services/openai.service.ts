const openaiConfig = require("../configs/openai.config");

async function analyzeSentiment(text: string) {
  const string = "Classify the sentiment in these tweets:\n" + text;
  const response = await openaiConfig.createCompletion({
    model: "text-davinci-003",
    prompt: string,
    temperature: 0,
    max_tokens: 60,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  if (response.status === 200) {
    console.log(response.data);
    return response.data.choices[0].text;
  }
  return;
}

module.exports = {
  analyzeSentiment,
};
