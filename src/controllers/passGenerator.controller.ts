import { RequestHandler } from "express"
import { generatePass } from "../services/passwordGenerator.service.js"

export const requestPassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await generatePass(req.userId)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
