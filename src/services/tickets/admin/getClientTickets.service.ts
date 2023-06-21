import { createError } from "../../../utils/errorUtils.js"
import { Tickets } from "../../../models/ticket.model.js"

export const getClientTicketsService = async (dataSort: string) => {
  const vipTickets = await Tickets.find({ isVip: true }).sort(dataSort)
  const nonVipTickets = await Tickets.find({ isVip: false }).sort(dataSort)

  if (!vipTickets.length && !nonVipTickets.length) {
    throw createError(
      404,
      "Not found",
      "There does not seem to be any tickets at this time"
    )
  }

  const response = {
    vip: vipTickets.map((ticket) => ({
      _id: ticket?._id,
      title: ticket?.title,
      body: ticket?.body,
      createdDate: ticket?.createdDate,
      status: ticket?.status,
      user: ticket?.user,
    })),
    nonVip: nonVipTickets.map((ticket) => ({
      _id: ticket?._id,
      title: ticket?.title,
      body: ticket?.body,
      createdDate: ticket?.createdDate,
      status: ticket?.status,
      user: ticket?.user,
    })),
  }

  return response
}
