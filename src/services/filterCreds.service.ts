import { CredentialModel } from "../types/types.js"
import { Credentials } from "../models/credential.model.js"
import { ErrorResponse } from "../index.js"

export async function filterCreds(
  current_user: string | unknown,
  title: string
) {
  if (!current_user) {
    const error: ErrorResponse = {
      message: "User not found",
      name: "Not found",
      status: 404,
    }
    throw error
  }

  const result = await Credentials.find({
    creator: current_user,
    title: { $regex: title.toString(), $options: "i" },
  })

  if (result.length === 0) {
    const error: ErrorResponse = {
      message: "Requested document could not be found",
      name: "Not found",
      status: 404,
    }
    throw error
  }

  return {
    result,
  }
}
