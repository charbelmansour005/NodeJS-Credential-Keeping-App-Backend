import { createError } from "../../../utils/errorUtils.js"
import { Tickets } from "../../../models/ticket.model.js"

const ItemsPerPage = 20

export async function getMyTicketsService(
  pageNumber: number,
  dataSort: string,
  current_user: string | unknown
) {
  if (!current_user) {
    throw createError(401, "Unauthorized", "Unauthorized")
  }

  const result = await Tickets.find({ creator: current_user })
    .select("-creator -__v")
    .skip((pageNumber - 1) * ItemsPerPage)
    .limit(ItemsPerPage)
    .sort(dataSort)

  if (!result.length) {
    throw createError(404, "Seems empty", "Seems empty")
  }

  return result
}
