import { ErrorResponse } from "../index.js"
import { Credentials } from "../models/credential.model.js"

export async function deleteCred(
  credId: string,
  current_user: string | unknown
) {
  const requestedCredential = await Credentials.findById(credId)

  if (!current_user) {
    const error: ErrorResponse = {
      message: "User not found",
      name: "Not found",
      status: 404,
    }
    throw error
  } else if (!requestedCredential) {
    const error: ErrorResponse = {
      message: "Credential not found",
      name: "Not found",
      status: 404,
    }
    throw error
  } else if (
    requestedCredential?.creator?.toString() !== current_user.toString()
  ) {
    const error: ErrorResponse = {
      message: "Unauthorized",
      name: "Unauthorized",
      status: 401,
    }
    throw error
  }

  const removedCredential = await Credentials.findByIdAndRemove(credId)

  return {
    removedCredential,
  }
}
