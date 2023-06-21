import { set, connect } from "mongoose"

export const connectMongoDB = async () => {
  try {
    set("strictQuery", false)
    console.log("MongoDB Connected!")
    await connect(process.env.ATLAS_URI!)
  } catch (error) {
    console.log(error)
  }
}
