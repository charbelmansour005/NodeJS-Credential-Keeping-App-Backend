import { Credentials } from "../../../models/credential.model.js"
import { createError } from "../../../utils/errorUtils.js"

export async function filterCreds(
  current_user: string | unknown,
  title: string | string[] | unknown
) {
  if (!current_user) {
    throw createError(404, "Not found", "User not found")
  }

  const queryResults = await Credentials.find({
    $and: [{ creator: current_user }, { $or: [{ title: { $regex: title } }] }],
  }).sort({ created_At: -1 })

  if (queryResults.length === 0) {
    throw createError(404, "Not found", "Requested document could not be found")
  }

  return {
    queryResults,
  }
}
