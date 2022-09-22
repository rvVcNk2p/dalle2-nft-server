import Token from '../../db/models/Token.js'

// ======
// TODO: Change the production and dev database connection
// ======
export const getTokenFromDb = async (tokenId) => {
	try {
		const token = await Token.findOneAndUpdate(
			{ tokenId },
			{ tokenId },
			{ upsert: true, new: true },
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
