import { Credentials } from "../../models/credential.model.js"
import { createError } from "../../utils/errorUtils.js"

export async function deleteCred(
  credId: string,
  current_user: string | unknown
) {
  const requestedCredential = await Credentials.findById(credId)

  if (!current_user) {
    throw createError(401, "Unauthorized", "Please sign in first")
  } else if (!requestedCredential) {
    throw createError(404, "Not found", "Credential not found")
  } else if (
    requestedCredential?.creator?.toString() !== current_user.toString()
  ) {
    throw createError(401, "Unauthorized", "Unauthorized")
  }

  const removedCredential = await Credentials.findByIdAndRemove(credId)

  return {
    removedCredential,
  }
}
