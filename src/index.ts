import express, {
  Request,
  Response,
  Express,
  NextFunction,
  json,
  urlencoded,
} from "express"
import { connect, set } from "mongoose"
import cors from "cors"
var PORT = 5400
var MONGODB_URI = "mongodb://localhost:27017"

export interface ErrorResponse extends Error {
  status: number
  data?: any
}

const app: Express = express()

app.use(cors())

app.use(urlencoded({ extended: false }))
app.use(json())

app.use("*", (req: Request, res: Response) => {
  return res.status(404).json({ message: "Could not find Endpoint!" })
})

app.use(
  (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const { message, status, data } = error
    res
      .status(status)
      .json({ message: message || "Internal server issues", data: data })
  }
)

const connectMongoDB = async () => {
  try {
    set("strictQuery", false)
    console.log("MongoDB Connected!")
    await connect(MONGODB_URI)
    app.listen(PORT)
    console.log(`listening on port ${PORT}!`)
  } catch (error) {
    console.log(error)
  }
}
connectMongoDB()
