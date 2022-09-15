import express from 'express';
import rateLimit from 'express-rate-limit'
import { Dalle } from 'dalle-node';
import * as dotenv from 'dotenv'
const app = express()

dotenv.config()

const { 
  PORT,
  RATE_LIMIT, 
  RATE_LIMIT_STANDARD_HEADER, 
  RATE_LIMIT_LEGACY_HEADER,
  BEARER_TOKEN
} = process.env

const port = PORT || 3000

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minutes
	max: RATE_LIMIT || 6, // Limit each IP to 6 requests per `window` (here, per 1 minutes)
	standardHeaders: RATE_LIMIT_STANDARD_HEADER || false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: RATE_LIMIT_LEGACY_HEADER || false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)


app.get('/fetch-images', async (req, res) => {
  try {
    const dalle = new Dalle(BEARER_TOKEN);
    const creditsSummary = await dalle.getCredits();
    const totalCreditsLeft = creditsSummary.aggregate_credits;
    
    res.json({ message: 'Hello World!', totalCreditsLeft})
  } catch(err) {
    res.json({ errorMessage: 'Something went wrong!'})
  }
})

app.get('/health', async (req, res) => {
  res.status(200).json({ status: "Everything is fina. Up and running." })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})