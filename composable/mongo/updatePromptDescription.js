import Token from '../../db/models/Token.js'

// ======
// TODO: Change the production and dev database connection
// ======
export const updatePromptDescription = async (tokenId, prompt, description) => {
	try {
		const token = await Token.findOneAndUpdate(
			{ tokenId },
			{
				prompt,
				description,
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
