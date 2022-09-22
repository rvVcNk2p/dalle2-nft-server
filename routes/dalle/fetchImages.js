import { Dalle } from 'dalle-node'
import express from 'express'
import useDalleGetCredits from '../../composable/dalle/useDalleGetCredits.js'
import useDalleGenerateImages from '../../composable/dalle/useDalleGenerateImages.js'

import * as dotenv from 'dotenv'
dotenv.config()

const { BEARER_TOKEN, FALLBACK_BEARER_TOKEN } = process.env

const router = express.Router()

router.get('/', async (_, res, __) => {
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

export { router as fetchImages }
