import { ethers } from 'ethers'
import axios from 'axios'

const { ENVIRONMENT } = process.env

const url =
	ENVIRONMENT === 'DEVELOPMENT'
		? 'https://gasstation-mumbai.matic.today/v2'
		: 'https://gasstation-mainnet.matic.network/v2'

export const useGasPrice = () => {
	// get max fees from gas station
	let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
	let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei

	const fetchGasPrice = async () => {
		try {
			const { data } = await axios.get(url)

			maxFeePerGas = ethers.utils.parseUnits(
				Math.ceil(data.fast.maxFee) + '',
				'gwei',
			)
			maxPriorityFeePerGas = ethers.utils.parseUnits(
				Math.ceil(data.fast.maxPriorityFee) + '',
				'gwei',
			)
		} catch {
			console.log('Something went wrong.')
		}
	}

	return {
		maxFeePerGas,
		maxPriorityFeePerGas,

		fetchGasPrice,
	}
}
