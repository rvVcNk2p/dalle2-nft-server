import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const { MONGO_DB_USERNAME, MONGO_DB_PASSWORD } = process.env

const CONNECTION_STRING = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.grkoddk.mongodb.net/?retryWrites=true&w=majority`

const connectDB = async () => {
	try {
		await mongoose.connect(CONNECTION_STRING, {
			useNewUrlParser: true,
			// useCreateIndex: true,
			// useFindAndModify: false,
			useUnifiedTopology: true,
		})

		console.log('MongoDB Connected...')
	} catch (err) {
		console.log(err.message)
		// Exit process with failure
		process.exit(1)
	}
}

export default connectDB
