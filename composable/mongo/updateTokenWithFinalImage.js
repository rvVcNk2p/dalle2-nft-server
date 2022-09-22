import Token from '../../db/models/Token.js'

// ======
// TODO: Change the production and dev database connection
// ======
export const updateTokenWithFinalImage = async (tokenId, finalImage) => {
	try {
		const token = await Token.findOneAndUpdate(
			{ tokenId },
			{
				finalImage,
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
