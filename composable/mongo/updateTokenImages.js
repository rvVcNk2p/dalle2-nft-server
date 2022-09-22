import Token from '../../db/models/Token.js'

// ======
// TODO: Change the production and dev database connection
// ======
export const updateTokenImages = async (tokenId, finalizedImages) => {
	try {
		const selectedToken = await Token.findOne({ tokenId })
		// TODO: remove unnecessary fields

		let imagesWithIteration = finalizedImages.map((image) => ({
			...image,
			iteration: selectedToken.images.length / 4 + 1,
		}))

		const token = await Token.findOneAndUpdate(
			{ tokenId },
			{
				$push: {
					images: {
						$each: imagesWithIteration,
					},
				},
			},
			{ new: true },
		)
		return {
			token,
			error: null,
		}
	} catch (error) {
		return {
			token: null,
			error,
		}
	}
}
