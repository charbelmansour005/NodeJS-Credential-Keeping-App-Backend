import { ErrorResponse } from "../index.js"
import { Credentials } from "../models/credential.model.js"

export async function getCreds(current_user: string | unknown) {
  const userCreds = await Credentials.find({ creator: current_user })

  if (!userCreds.length) {
    const error: ErrorResponse = {
      message: "Credential not found",
      name: "Not found",
      status: 404,
    }
    throw error
  }
  return {
    userCreds,
  }
}
