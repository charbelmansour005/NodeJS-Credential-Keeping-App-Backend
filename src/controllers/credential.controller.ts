import { Credentials } from "../models/credential.model.js"
import { CredentialModel } from "../types/types.js"
import { RequestHandler } from "express"
import { ErrorResponse } from "../index.js"

export const getCredentials: RequestHandler = async (req, res, next) => {
  try {
    const creds = await Credentials.find()
    return res.status(200).json({ creds: creds })
  } catch (error) {
    next(error)
  }
}

export const getCredential: RequestHandler = async (req, res, next) => {
  try {
    const { credId } = req.params
    const cred = await Credentials.findById(credId)

    if (!cred) {
      const error: ErrorResponse = {
        message: "Credential not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }
    return res.status(200).json({ credential: cred })
  } catch (error) {
    next(error)
  }
}
