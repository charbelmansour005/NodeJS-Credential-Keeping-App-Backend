import { Tickets } from "../../../models/ticket.model.js"
import { User } from "../../../models/user.model.js"
import { Status, TicketModel } from "../../../types/types.js"
import { createError } from "../../../utils/errorUtils.js"

export async function createTicketService(
  current_user: string | unknown,
  ticketBody: TicketModel
) {
  const { title, body } = ticketBody

  if (!current_user) {
    throw createError(401, "Unauthorized", "Unauthorized")
  }

  const client = await User.findOne({ _id: current_user })

  const createdDate = Date.now()

  if (!title || !body) {
    throw createError(
      404,
      "Missing",
      "Your ticket seems unfinished, please complete it before submitting"
    )
  }

  const isVip = client.isVip

  const user = {
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
  }

  const clientTicket = new Tickets({
    title: title,
    body: body,
    createdDate: createdDate,
    status: Status.PENDING,
    creator: current_user,
    user: user,
    isVip: isVip ? true : false,
  })

  await clientTicket.save()
}
