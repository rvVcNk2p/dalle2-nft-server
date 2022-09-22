import * as ipfsClient from 'ipfs-http-client'
import * as dotenv from 'dotenv'
dotenv.config()

const { INFURA_PROJECT_ID, INFURA_SECRET } = process.env

export const uploadImgToIpfs = async (imagePaths) => {
	const ipfs = ipfsClient.create({
		host: 'ipfs.infura.io',
		port: 5001,
		protocol: 'https',
		headers: {
			authorization:
				'Basic ' +
				Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_SECRET).toString('base64'),
		},
	})

	return await Promise.all(
		await imagePaths.map(async (imagePath) => {
			try {
				const { cid } = await ipfs.add(ipfsClient.urlSource(imagePath.path))
				return { cid: cid.toString(), error: null, id: imagePath.id }
			} catch (error) {
				return {
					cid: null,
					error,
				}
			}
		}),
	)
}
