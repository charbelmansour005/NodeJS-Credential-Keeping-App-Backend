import { Credentials } from "../models/credential.model.js"
import { CredentialModel } from "../types/types.js"
import { createError } from "../utils/errorUtils.js"

export async function filterCreds(
  current_user: string | unknown,
  credential: CredentialModel
) {
  const { title } = credential

  if (!current_user) {
    throw createError(404, "Not found", "User not found")
  }

  const filteredCredentials = await Credentials.find({
    creator: current_user,
    title: { $regex: title.toString(), $options: "i" },
  })

  if (filteredCredentials.length === 0) {
    throw createError(404, "Not found", "Requested document could not be found")
  }

  return {
    filteredCredentials,
  }
}
