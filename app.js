import express from 'express';
import cors from 'cors';
import { Dalle } from 'dalle-node';
import * as dotenv from 'dotenv'
const app = express()

dotenv.config()

const { 
  PORT,
  BEARER_TOKEN,
  ENVIRONMENT
} = process.env

const port = PORT || 3000

const whitelist = ['https://brilliant-sfogliatella-a87a4e.netlify.app', 'https://brilliant-sfogliatella-a87a4e.netlify.app/']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

process.env.ENVIRONMENT !== 'DEVELOPMENT' ? app.use(cors(corsOptions)) : null

app.get('/fetch-images', async (req, res, next) => {
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