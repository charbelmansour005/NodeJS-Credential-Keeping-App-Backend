import { ErrorResponse } from "./../index.js"
import { v4 as uuidv4 } from "uuid"
import { RequestHandler } from "express"

export const requestPassword: RequestHandler = async (req, res, next) => {
  try {
    const current_user = req.userId
    if (!current_user) {
      const error: ErrorResponse = {
        message: "User not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }

    res.status(201).json({ password: uuidv4() })
  } catch (error) {
    next(error)
  }
}
