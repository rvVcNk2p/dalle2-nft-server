import { Dalle } from 'dalle-node'
import * as dotenv from 'dotenv'
import { AbortController } from 'node-abort-controller'

global.AbortController = AbortController
dotenv.config()

const { BEARER_TOKEN, FALLBACK_BEARER_TOKEN } = process.env

import useDalleGetCredits from './composable/dalle/useDalleGetCredits.js'
import useDalleGenerateImages from './composable/dalle/useDalleGenerateImages.js'
import { useGasPrice } from './composable/useGasPrice.js'

import { uploadImgToIpfs } from './composable/useIpfsUpload.js'
import { checkNftOwnership } from './composable/nft/checkNftOwnership.js'
import { checkNftStatus } from './composable/nft/checkNftStatus.js'
import { setNftImage } from './composable/nft/setNftImage.js'

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

	app.post('/set-nft', async (req, res) => {
		const { tokenId, imgId, imagePath, taskId, address } = req.body

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
				value: isOwner,
				error: ownershipErr,
			})
		}
		if (isOwner) {
			console.log(`✅ The NFT is belongs to: ${address}!`)
		}

		const { isAlreadyUpdated, error: statusErr } = await checkNftStatus(tokenId)
		// If the requested NFT has already been setted
		if (isAlreadyUpdated || statusErr) {
			const { code, reason } = statusErr
			console.log(`❌ [${code}] Nft status error: ${reason}`)
			res.json({
				field: 'status',
				value: isAlreadyUpdated,
				error: statusErr,
			})
		}
		if (!isAlreadyUpdated) {
			console.log(`✅ The NFT has not updated yet!`)
		}

		const { cid, error: ipfsErr } = await uploadImgToIpfs(imagePath)
		// If the uploadable image ipfs upload has been failed
		if (cid === null || ipfsErr) {
			const { code, reason } = ipfsErr
			console.log(`❌ [${code}] IPFS error: ${reason}`)
			res.json({
				field: 'ipfs',
				value: cid,
				error: ipfsErr,
			})
		}
		if (cid) {
			console.log(`✅ Image uploaded to IPFS successfully, with CID: ${cid}!`)
		}
		// Fetch required fee prices
		const { maxFeePerGas, maxPriorityFeePerGas, fetchGasPrice } = useGasPrice()
		await fetchGasPrice()
		if (maxFeePerGas && maxPriorityFeePerGas) {
			console.log(`✅ The FeePerGas fetching has been completed.`)
		}

		const { txResponse, error: txError } = await setNftImage(
			tokenId,
			cid,
			maxFeePerGas,
			maxPriorityFeePerGas,
		)

		if (txResponse === 'SUCCESS') {
			console.log(`✅ The requested image has been setted!`)
			res.json({
				field: 'txResponse',
				value: 'SUCCESS',
				error: txError,
			})
		} else {
			const { code, reason } = txError
			console.log(`❌ [${code}] txResponse: ${reason}`)
			res.json({
				field: 'txResponse',
				value: 'ERROR',
				error: txError,
			})
		}
	})

	app.get('/health-check', async (_, res) => {
		res
			.json({
				statusMessage: 'Everything is upp and running.',
			})
			.status(200)
	})
}

export default initRouter
