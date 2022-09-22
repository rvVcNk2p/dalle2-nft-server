import { AbortController } from 'node-abort-controller'
global.AbortController = AbortController

import { fetchImages } from './routes/dalle/fetchImages.js'
import { setNft } from './routes/nft/setNft.js'

const initRouter = (app) => {
	app.use('/fetch-images', fetchImages)
	app.use('/set-nft', setNft)

	app.get('/health-check', async (_, res) => {
		res
			.json({
				statusMessage: 'Everything is upp and running.',
			})
			.status(200)
	})
}

export default initRouter
