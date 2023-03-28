import { RequestHandler } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import { ErrorResponse } from "../index.js"
import { User } from "../models/user.model.js"
import { createError } from "../utils/errorUtils.js"

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization")

    if (!authHeader) {
      throw createError(401, "Unauthenticated", "Unauthenticated")
    }

    const access_token = authHeader.split(" ")[1]

    let decodedToken: string | JwtPayload
    try {
      decodedToken = verify(access_token, process.env.SECRET as string) as {
        userId: string
        role: string
      }
      const user = await User.findOne({ _id: decodedToken.userId })
      if (user.logoutAll === true) {
        throw createError(
          401,
          "Unauthenticated",
          "Your password has been changed, please sign in again"
        )
      }
    } catch (error) {
      const { message, name } = error as Error
      throw createError(409, name, message)
    }

    if (!decodedToken) {
      throw createError(401, "Unauthorized", "Unauthorized")
    }

    const { userId } = decodedToken as JwtPayload

    req.userId = userId
    next()
  } catch (error) {
    next(error)
  }
}
