import { ErrorResponse } from "./../index.js"
import { v4 as uuidv4 } from "uuid"
import { RequestHandler } from "express"
import { User } from "../models/user.model.js"

export const requestPassword: RequestHandler = async (req, res, next) => {
  try {
    const current_user = req.userId
    const foundUser = await User.findOne({ _id: current_user })
    if (!foundUser) {
      const error: ErrorResponse = {
        message: "User not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }

    res.status(200).json({ password: uuidv4() })
  } catch (error) {
    next(error)
  }
}
