import { Dalle } from 'dalle-node'
import express from 'express'
import { STATUS_CODE } from '../../utils/constants.js'

import { useDalleGetCredits } from '../../composable/dalle/useDalleGetCredits.js'
import { useGeneratePrompt } from '../../composable/dalle/useGeneratePrompt.js'
import { useDalleGenerateImages } from '../../composable/dalle/useDalleGenerateImages.js'

import { getTokenFromDb } from '../../composable/mongo/getTokenFromDb.js'
import { updateTokenImages } from '../../composable/mongo/updateTokenImages.js'
import { updatePromptDescription } from '../../composable/mongo/updatePromptDescription.js'

import { checkNftStatus } from '../../composable/nft/checkNftStatus.js'
import { checkNftOwnership } from '../../composable/nft/checkNftOwnership.js'
import { uploadImgToIpfs } from '../../composable/useIpfsUpload.js'

import * as dotenv from 'dotenv'
dotenv.config()

const { BEARER_TOKEN, FALLBACK_BEARER_TOKEN } = process.env

const router = express.Router()

router.get('/', async (req, res, __) => {
	const { tokenId, address } = req?.query
	if (tokenId && address) {
		// == START == Ownership check
		const { isOwner, error: ownershipErr } = await checkNftOwnership(
			address,
			tokenId,
		)
		// If the request initiator do not owns the NFT throw an error
		if (!isOwner || ownershipErr) {
			const { code, reason } = ownershipErr
			console.log(`❌ [${code}] Nft status error: ${reason}`)
			res.json({
				field: 'owner',
				value: STATUS_CODE.ERROR,
				error: ownershipErr,
			})
		}
		if (isOwner) {
			console.log(`✅ The NFT is belongs to: ${address}!`)
		}
		// == END == Ownership check
		// == START == Nft Status
		const { isAlreadyUpdated, error: statusErr } = await checkNftStatus(tokenId)
		// If the requested NFT has already been setted
		if (isAlreadyUpdated || statusErr) {
			const { code, reason } = statusErr
			console.log(`❌ [${code}] Nft status error: ${reason}`)
			res.json({
				field: 'status',
				value: STATUS_CODE.ERROR,
				error: statusErr,
			})
		}
		if (!isAlreadyUpdated) {
			console.log(`✅ The NFT has not updated yet!`)
		}
		// == END == Nft Status
		// == STAT == Has tokenId generated images
		const { token, error: dbErr } = await getTokenFromDb(tokenId)
		if (dbErr) {
			console.log(
				`❌ getTokenFromDb: Something went wrong during DB fetch. TokenId: ${tokenId}.`,
			)
			console.log(`== Full error log: ${dbErr}`)
		} else if (token && !token.images.length) {
			console.log(`✅ New image request initaited with tokenId: ${tokenId}.`)
			const dalle = new Dalle(BEARER_TOKEN)

			// == START == Get remaining credits
			const { totalCreditsLeft, fetchError: creditFetchError } =
				await useDalleGetCredits(dalle)

			if (creditFetchError) {
				const reason =
					'Something went wrong during the [remaining credits fetch]!'
				console.log(`❌ ${reason}`)
				res.json({
					field: 'credit',
					value: STATUS_CODE.ERROR,
					error: {
						reason,
					},
				})
			} else if (totalCreditsLeft === 0) {
				console.log(`❌ Run out of credits. Buy a new batch of credits!`)
				// TODO: Send a notification to server owner and buy new credits
				res.json({
					field: 'credit',
					value: STATUS_CODE.ERROR,
					error: {
						reason:
							'Something went wrong during the [remaining credits fetch]!',
					},
				})
			}

			console.log(`✅ Remaining credits: ${totalCreditsLeft}`)
			// == END == Get remaining credits

			// == START == Generate new images by prompt
			const { prompt, description } = await useGeneratePrompt()

			const { generations, fetchError: imageFetchError } =
				await useDalleGenerateImages(dalle, prompt, true) // If true, will return the dummy images

			if (imageFetchError) {
				const reason = 'Something went wrong during art fetch.'
				console.log(`❌ ${reason}`)
				res.json({
					field: 'art',
					value: STATUS_CODE.ERROR,
					error: {
						reason,
					},
				})
			}
			// == END == Generate new images by prompt

			// == STAT == Batch img ipfs upload "image_path"
			const results = await uploadImgToIpfs(
				generations.map((image) => ({
					path: image.generation.image_path,
					id: image.id,
				})),
			)
			// == END == Batch img ipfs upload "image_path"
			// TODO: Error check...

			const finalizedImages = results.map((result) => {
				const { id, cid } = result
				const { generation, task_id } = generations.find((x) => x.id === id)
				return {
					id,
					path: generation.image_path,
					taskId: task_id,
					cid,
				}
			})

			// == START == Save mapped items to DB
			const updatedResult = await updateTokenImages(tokenId, finalizedImages)
			// TODO: Safty check
			await updatePromptDescription(tokenId, prompt, description)
			// == END ==

			if (updatedResult.token.images.length) {
				console.log(
					`✅ Initial image request has been completed successfully. Here we go!`,
				)
				res.json({ generationImages: updatedResult.token.images, description })
			} else {
				console.log(`❌ NO IMAGES - CHECK THIS OUT!`)
				res.json({ generationImages: [] })
			}
		} else {
			const { images, description } = token

			console.log(`✅ User already generated some images! Here we go!`)
			res.json({ generationImages: images, description })
		}
		// == END == Has tokenId generated images
	} else {
		const reason = 'Query parameter "tokenId" or "address" does not exists!'
		console.log(`❌ [400] Missing query params: ${reason}`)
		res.json({
			field: 'query params',
			value: STATUS_CODE.ERROR,
			error: { reason },
		})
	}
})

export { router as fetchImages }
