import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema({
	tokenId: {
		type: String,
		required: true,
	},
	finalImage: {
		type: String,
		default: '',
	},
	prompt: {
		type: String,
		default: '',
	},
	description: {
		type: String,
		default: '',
	},
	images: [
		{
			iteration: Number,
			id: String,
			path: String,
			taskId: String,
			cid: String,
		},
	],
})

const Token = mongoose.model('token', TokenSchema)

export default Token
