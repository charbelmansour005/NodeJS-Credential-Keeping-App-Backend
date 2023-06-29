import { set, connect } from "mongoose"

export const connectMongoDB = async () => {
  try {
    set("strictQuery", false)
    console.log("MongoDB Connected!")
    await connect(
      "mongodb+srv://charbelmansour005:1EMFNh1tE9ZhnjaV@cluster0.0dky3d4.mongodb.net/?retryWrites=true&w=majority"
    )
    // await connect(process.env.ATLAS_URI!)
  } catch (error) {
    console.log(error)
  }
}
