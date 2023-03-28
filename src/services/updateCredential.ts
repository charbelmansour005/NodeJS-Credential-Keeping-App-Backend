import { Credentials } from "../models/credential.model.js"
import { CredentialModel } from "../types/types.js"
import { ErrorResponse } from "../index.js"

export async function updateCredential(
  userId: string | unknown,
  credId: string,
  credential: CredentialModel
): Promise<{ updatedTitle: string; updatedKey: string }> {
  try {
    const { title, key } = credential
    const updated_At = new Date()

    const requestedCredential = await Credentials.findById(credId)

    if (!requestedCredential) {
      const error: ErrorResponse = {
        message: "Requested credential not found",
        name: "Not found",
        status: 404,
      }
      throw error
    } else if (requestedCredential.creator.toString() !== userId) {
      const error: ErrorResponse = {
        message: "Unauthorized",
        name: "Unauthorized",
        status: 401,
      }
      throw error
    } else if (!title || !key) {
      const error: ErrorResponse = {
        message: "Please fill all required fields",
        name: "Missing fields",
        status: 404,
      }
      throw error
    }

    requestedCredential.title = title
    requestedCredential.key = key
    requestedCredential.updated_At = updated_At

    const result = await requestedCredential.save()

    return {
      updatedTitle: result.title,
      updatedKey: result.key,
    }
  } catch (error) {
    console.log(error)
  }
}
