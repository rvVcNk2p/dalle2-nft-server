import { Dalle } from 'dalle-node'
import * as dotenv from 'dotenv'
import * as ipfsClient from 'ipfs-http-client'
import { AbortController } from 'node-abort-controller'

global.AbortController = AbortController
dotenv.config()

const {
	BEARER_TOKEN,
	INFURE_IPFS_HOST,
	INFURE_IPFS_PORT,
	INFURA_PROJECT_ID,
	INFURA_SECRET,
} = process.env

import useDalleGetCredits from './composable/useDalleGetCredits.js'
import useDalleGenerateImages from './composable/useDalleGenerateImages.js'

const initRouter = (app) => {
	app.get('/fetch-images', async (req, res) => {
		const dalle = new Dalle(BEARER_TOKEN)
		/*
		 *  Generate new/dummy images by prompt
		 */
		const prompt = 'a horse, painting by Leonid Afremov'
		const { generations, fetchError: imageFetchError } =
			await useDalleGenerateImages(dalle, prompt, true)

		/*
		 *  Get remaining credits
		 */
		const { totalCreditsLeft, fetchError: creditFetchError } =
			await useDalleGetCredits(dalle)
		if (!imageFetchError && !creditFetchError)
			res.json({ totalCreditsLeft, generations })

		if (imageFetchError)
			res.json({
				errorMessage: 'Something went wrong during the [new image fetch]!',
			})
		if (creditFetchError)
			res.json({
				errorMessage:
					'Something went wrong during the [remaining credits fetch]!',
			})
	})

	app.get('/test-ipfs', async (_, res) => {
		// Upload a json to infura ipfs
		//const { cid } = await ipfs.add("{name: 'Leo'}")
		const ipfs = ipfsClient.create({
			host: INFURE_IPFS_HOST || 'ipfs.infura.io',
			port: INFURE_IPFS_PORT || 5001,
			protocol: 'https',
			headers: {
				authorization:
					'Basic ' +
					Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_SECRET).toString(
						'base64',
					),
			},
		})

		try {
			const { cid } = await ipfs.add(
				ipfsClient.urlSource(
					'https://cdn.openai.com/labs/images/A%20comic%20book%20cover%20of%20a%20superhero%20wearing%20headphones.webp',
				),
			)
			console.log('CID: ', cid)
			res.json({ cid: cid.toString() })
		} catch (error) {
			res.json(error)
		}
	})
}

export default initRouter
