import { ErrorResponse } from "../index.js"
import { Credentials } from "../models/credential.model.js"
import { CredentialModel } from "../types/types.js"

export async function addCred(
  current_user: string | unknown,
  credential: CredentialModel
) {
  const { title, key } = credential

  if (!current_user) {
    const error: ErrorResponse = {
      message: "User not found",
      name: "Not found",
      status: 404,
    }
    throw error
  }

  if (!title || !key) {
    const error: ErrorResponse = {
      message: "Both a key and a title must be provided",
      name: "Missing element",
      status: 404,
    }
    throw error
  }

  const newCredentialSet = await Credentials.create({
    title: title,
    key: key,
    creator: current_user,
  })

  const result = await newCredentialSet.save()

  return {
    result,
  }
}
