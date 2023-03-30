import { Tickets } from "../../../models/ticket.model.js"
import { Status, TicketModel } from "../../../types/types.js"
import { createError } from "../../../utils/errorUtils.js"

export const updateClientTicketsService = async (
  ticketId: string,
  current_user: string | unknown,
  updateTicketBody: TicketModel
) => {
  const { status } = updateTicketBody

  if (!current_user) {
    throw createError(401, "Unauthorized", "Unauthorized")
  }

  const ticketToUpdate = await Tickets.findOne({ _id: ticketId })

  if (!status) {
    throw createError(404, "Missing", "Missing status")
  }

  if (
    status !== Status.INPROGRESS &&
    status !== Status.REJECTED &&
    status !== Status.RESOLVED &&
    status !== Status.PENDING
  ) {
    throw createError(
      422,
      "Unprocessable",
      `The updated status can either be ${Status.INPROGRESS}, ${Status.REJECTED} or ${Status.RESOLVED} `
    )
  }

  ticketToUpdate.status = status

  const result = await ticketToUpdate.save()

  return result
}
