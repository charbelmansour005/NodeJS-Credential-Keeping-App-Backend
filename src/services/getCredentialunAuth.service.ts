import { ErrorResponse } from "../index.js"
import { Credentials } from "../models/credential.model.js"

export async function getCredentialunAuth(credId: string): Promise<{}> {
  const result = await Credentials.findOne({ _id: credId })

  if (!result) {
    const error: ErrorResponse = {
      message: "Credential not found",
      name: "Not found",
      status: 404,
    }
    throw error
  }

  return {
    credential: result,
  }
}
