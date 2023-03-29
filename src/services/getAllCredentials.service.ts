import { Credentials } from "../models/credential.model.js"
import { createError } from "../utils/errorUtils.js"

export async function getAllCredentials(
  pageNumber: number,
  dataSort: string,
  ItemsPerPage: number
) {
  const credentials = await Credentials.find()
    .skip((pageNumber - 1) * ItemsPerPage)
    .limit(ItemsPerPage)
    .sort(dataSort)

  if (!credentials) {
    throw createError(404, "Not Found", "We couldn't find any credentials")
  }

  return credentials
}
