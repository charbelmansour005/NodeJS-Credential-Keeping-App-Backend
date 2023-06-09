import * as dotenv from "dotenv"
dotenv.config()
import express, {
  Request,
  Response,
  Express,
  NextFunction,
  json,
  urlencoded,
} from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import credRoutes from "./routes/credentials.routes.js"
import passGeneratorRoutes from "./routes/passGenerator.routes.js"
import ticketRoutes from "./routes/ticket.routes.js"
import frontendRoutes from "./routes/frontend.routes.js"
import { connectMongoDB } from "./db/mongoose.db.js"
var PORT = 5400

export interface ErrorResponse extends Error {
  status: number
  data?: any
}

const app: Express = express()

app.use(json())
app.use(cors())
app.use(urlencoded({ extended: false }))

app.use("/api/auth", authRoutes)
app.use("/api", credRoutes)
app.use("/api", passGeneratorRoutes)
app.use("/api", ticketRoutes)
app.use("/api", frontendRoutes)

app.use("*", (req: Request, res: Response) => {
  return res.status(404).json({ message: "Could not find Endpoint!" })
})

app.use(
  (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const { message, status, data } = error
    res
      .status(status || 404)
      .json({ message: message || "Internal server issues", data: data })
  }
)

connectMongoDB()
  .then(() => {})
  .catch((e) => {
    console.log(e)
  })

app.listen(process.env.PORT || PORT)
console.log(`Listening on port ${process.env.PORT || PORT}`)
