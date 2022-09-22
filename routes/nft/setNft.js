import express from 'express'
import { STATUS_CODE } from '../../utils/constants.js'

import { useGasPrice } from '../../composable/useGasPrice.js'

import { uploadImgToIpfs } from '../../composable/useIpfsUpload.js'
import { checkNftOwnership } from '../../composable/nft/checkNftOwnership.js'
import { checkNftStatus } from '../../composable/nft/checkNftStatus.js'
import { setNftImage } from '../../composable/nft/setNftImage.js'

import * as dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

router.post('/', async (req, res, __) => {
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
			value: STATUS_CODE.ERROR,
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
			value: STATUS_CODE.ERROR,
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
			value: STATUS_CODE.ERROR,
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
			value: STATUS_CODE.SUCCESS,
			error: txError,
		})
	} else {
		const { code, reason } = txError
		console.log(`❌ [${code}] txResponse: ${reason}`)
		res.json({
			field: 'txResponse',
			value: STATUS_CODE.ERROR,
			error: txError,
		})
	}
})

export { router as setNft }
