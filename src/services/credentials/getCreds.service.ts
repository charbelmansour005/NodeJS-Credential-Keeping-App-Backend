import { Credentials } from "../../models/credential.model.js"
import { createError } from "../../utils/errorUtils.js"

export async function getCreds(
  current_user: string | unknown,
  ItemsPerPage: number,
  pageNumber: number,
  dataSort: string
) {
  if (!current_user) {
    throw createError(404, "Unauthorized", "Unauthorized")
  }

  const credentials = await Credentials.find({ creator: current_user })
    .skip((pageNumber - 1) * ItemsPerPage)
    .limit(ItemsPerPage)
    .sort(dataSort)

  if (credentials.length === 0) {
    throw createError(
      404,
      "Not found",
      "You don't have any secured credentials yet. Start by adding some."
    )
  }
  return {
    credentials,
  }
}
