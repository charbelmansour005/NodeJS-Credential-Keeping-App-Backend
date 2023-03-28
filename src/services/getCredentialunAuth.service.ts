import { Credentials } from "../models/credential.model.js"
import { createError } from "../utils/errorUtils.js"

export async function getCredentialunAuth(credId: string): Promise<{}> {
  const result = await Credentials.findOne({ _id: credId })

  if (!result) {
    throw createError(404, "Not found", "Credential not found")
  }

  return {
    credential: result,
  }
}
