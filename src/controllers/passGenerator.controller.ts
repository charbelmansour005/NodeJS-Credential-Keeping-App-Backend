import { RequestHandler } from "express"
import { generatePass } from "../services/passwordGenerator.service.js"

export const requestPassword: RequestHandler = async (req, res, next) => {
  try {
    const generatedPassword = await generatePass(req.userId)

    res.status(200).json({ password: generatedPassword })
  } catch (error) {
    next(error)
  }
}
