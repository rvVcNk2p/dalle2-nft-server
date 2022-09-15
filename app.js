import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
import initRouter from './routes.js'
initRouter(app)

const { 
  PORT,
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

ENVIRONMENT !== 'DEVELOPMENT' ? app.use(cors(corsOptions)) : null

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})