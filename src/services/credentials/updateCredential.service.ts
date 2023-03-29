import { Credentials } from "../../models/credential.model.js"
import { CredentialModel } from "../../types/types.js"
import { createError } from "../../utils/errorUtils.js"

export async function updateCredential(
  userId: string | unknown,
  credId: string,
  credential: CredentialModel
): Promise<{ updatedTitle: string; updatedKey: string }> {
  const { title, key } = credential
  const updated_At = new Date()

  const requestedCredential = await Credentials.findById(credId)

  if (!requestedCredential) {
    throw createError(404, "Not found", "Requested credential not found")
  } else if (requestedCredential.creator.toString() !== userId) {
    throw createError(401, "Unauthorized", "Unauthorized")
  } else if (!title || !key) {
    throw createError(404, "Missing fields", "Please fill all required fields")
  }

  requestedCredential.title = title
  requestedCredential.key = key
  requestedCredential.updated_At = updated_At

  const result = await requestedCredential.save()

  return {
    updatedTitle: result.title,
    updatedKey: result.key,
  }
}
