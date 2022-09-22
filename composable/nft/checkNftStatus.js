import ethers from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config()

import { CurratedLabsOriginalsABI } from '../../abi/CurratedLabsOriginalsABI.js'

const {
	ENVIRONMENT,
	POLYGON_ALCHEMY_API,
	MUMBAI_ALCHEMY_API,
	POLYGON_CONTRACT_ADDRESS,
	MUMBAI_CONTRACT_ADDRESS,
} = process.env

const CURRATED_LABS_CONTRACT_ADDRESS =
	ENVIRONMENT === 'DEVELOPMENT'
		? MUMBAI_CONTRACT_ADDRESS
		: POLYGON_CONTRACT_ADDRESS

const ALCHEMY_API_KEY =
	ENVIRONMENT === 'DEVELOPMENT' ? MUMBAI_ALCHEMY_API : POLYGON_ALCHEMY_API

const PRC_PROVIDER_URL = `https://polygon-${
	ENVIRONMENT === 'DEVELOPMENT' ? 'mumbai' : 'mainnet'
}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`

export const checkNftStatus = async (tokenId) => {
	try {
		const provider = new ethers.providers.JsonRpcProvider(PRC_PROVIDER_URL)

		const constractFactory = new ethers.Contract(
			CURRATED_LABS_CONTRACT_ADDRESS,
			CurratedLabsOriginalsABI,
			provider,
		)

		const isAlreadyUpdated =
			await constractFactory.isMindedNftImageHasBeenSetted(tokenId)
		return {
			isAlreadyUpdated,
			error: null,
		}
	} catch (error) {
		return {
			isAlreadyUpdated: null,
			error,
		}
	}
}
