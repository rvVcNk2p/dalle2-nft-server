import * as ipfsClient from 'ipfs-http-client'
import * as dotenv from 'dotenv'
dotenv.config()

const { INFURE_IPFS_HOST, INFURE_IPFS_PORT, INFURA_PROJECT_ID, INFURA_SECRET } =
	process.env

export const uploadImgToIpfs = async (imagePath) => {
	const ipfs = ipfsClient.create({
		host: INFURE_IPFS_HOST || 'ipfs.infura.io',
		port: INFURE_IPFS_PORT || 5001,
		protocol: 'https',
		headers: {
			authorization:
				'Basic ' +
				Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_SECRET).toString('base64'),
		},
	})

	try {
		const { cid } = await ipfs.add(ipfsClient.urlSource(imagePath))
		return { cid: cid.toString(), error: null }
	} catch (error) {
		return {
			cid: null,
			error,
		}
	}
}
