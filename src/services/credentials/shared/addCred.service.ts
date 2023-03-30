import { Credentials } from "../../../models/credential.model.js"
import { CredentialModel } from "../../../types/types.js"
import { createError } from "../../../utils/errorUtils.js"

export async function addCred(
  current_user: string | unknown,
  credential: CredentialModel
) {
  const { title, key } = credential

  if (!current_user) {
    throw createError(401, "Not found", "User not found")
  }

  if (!title || !key) {
    throw createError(
      404,
      "Missing element",
      "Both a key and a title must be provided"
    )
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
