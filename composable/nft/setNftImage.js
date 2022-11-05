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
	DEPLOYER_PRIVATE_KEY,
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

export const setNftImage = async (
	tokenId,
	cid,
	description,
	maxFeePerGas,
	maxPriorityFeePerGas,
) => {
	try {
		const network = ENVIRONMENT === 'DEVELOPMENT' ? 'maticmum' : 'matic'
		const alchemyProvider = new ethers.providers.AlchemyProvider(
			network,
			ALCHEMY_API_KEY,
		)
		const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, alchemyProvider)

		const constractFactory = new ethers.Contract(
			CURRATED_LABS_CONTRACT_ADDRESS,
			CurratedLabsOriginalsABI,
			signer,
		)

		const tx = await constractFactory.setMintedNftImage(
			tokenId,
			cid,
			description,
			{
				maxFeePerGas,
				maxPriorityFeePerGas,
				gasLimit: ethers.utils.parseUnits('15000000', 'wei'),
			},
		)

		await tx.wait()

		return {
			txResponse: 'SUCCESS',
			error: null,
		}
	} catch (error) {
		console.log(error)
		return {
			txResponse: null,
			error,
		}
	}
}
