import { RequestHandler } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import { ErrorResponse } from "../index.js"
import { User } from "../models/user.model.js"

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization")

    if (!authHeader) {
      const error: ErrorResponse = {
        message: "Unauthenticated",
        name: "Unauthenticated",
        status: 401,
      }
      throw error
    }

    const access_token = authHeader.split(" ")[1]

    let decodedToken: string | JwtPayload

    try {
      decodedToken = verify(access_token, process.env.SECRET as string) as {
        userId: string
      }
      const user = User.findOne({ _id: decodedToken.userId })
      if ((await user).logoutAll === true) {
        const error: ErrorResponse = {
          message: "Your password has been changed, please sign in again",
          name: "Unauthenticated",
          status: 401,
        }
        throw error
      }
    } catch (error) {
      const { message, name } = error as Error
      const thrownError: ErrorResponse = {
        message: message,
        name: name,
        status: 409,
      }
      throw thrownError
    }

    if (!decodedToken) {
      const error: ErrorResponse = {
        message: "Unauthorized",
        name: "Unauthorized",
        status: 401,
      }
      throw error
    }

    const { userId } = decodedToken as JwtPayload

    req.userId = userId
    next()
  } catch (error) {
    next(error)
  }
}
