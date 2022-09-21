import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()

const { PORT, ENVIRONMENT, DEV_WHITELIST_URL } = process.env

const port = PORT || 3000

const whitelist = ['https://brilliant-sfogliatella-a87a4e.netlify.app']
ENVIRONMENT === 'DEVELOPMENT' ? whitelist.push(DEV_WHITELIST_URL) : null

const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

import initRouter from './routes.js'
initRouter(app)

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})
