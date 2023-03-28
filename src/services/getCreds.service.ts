import { Credentials } from "../models/credential.model.js"
import { createError } from "../utils/errorUtils.js"

export async function getCreds(current_user: string | unknown) {
  const userCreds = await Credentials.find({ creator: current_user })

  if (!userCreds.length) {
    throw createError(
      404,
      "Not found",
      "You don't have any secured credentials yet. Start by adding some."
    )
  }
  return {
    userCreds,
  }
}
