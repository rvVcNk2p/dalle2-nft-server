import express from 'express';
import { Dalle } from 'dalle-node';
import * as dotenv from 'dotenv'
const app = express()

dotenv.config()

const port = process.env.PORT || 3000

app.get('/fetch-images', async (req, res) => {
  try {
    const dalle = new Dalle(process.env.BEARER_TOKEN);
    const creditsSummary = await dalle.getCredits();
    const totalCreditsLeft = creditsSummary.aggregate_credits;
    
    res.json({ message: 'Hello World!', totalCreditsLeft})
  } catch(err) {
    res.json({ errorMessage: 'Something went wrong!'})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})