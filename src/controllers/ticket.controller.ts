import { TicketModel } from "../types/types.js"
import { Tickets } from "../models/ticket.model.js"
import { RequestHandler } from "express"
import { Status } from "../types/types.js"
import { createError } from "../utils/errorUtils.js"
import { ParsedQs } from "qs"

const ItemsPerPage = 20

export const createTicket: RequestHandler = async (req, res, next) => {
  try {
    const { title, body } = req.body as TicketModel
    const createdDate = Date.now()

    if (!req.userId) {
      throw createError(401, "Unauthorized", "Unauthorized")
    }

    if (!title || !body) {
      throw createError(
        404,
        "Missing",
        "Your ticket seems unfinished, please complete it before submitting"
      )
    }

    const clientTicket = new Tickets({
      title: title,
      body: body,
      createdDate: createdDate,
      status: Status.PENDING,
      creator: req.userId,
    })

    const result = await clientTicket.save()

    res.status(201).json({
      message: "Ticket created successfully",
      details: {
        title: title,
        body: body,
        status: result.status,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMyTickets: RequestHandler = async (req, res, next) => {
  try {
    const { page, sort }: ParsedQs = req.query

    const pageNumber = Number(page)
    const dataSort = String(sort)

    if (!req.userId) {
      throw createError(401, "Unauthorized", "Unauthorized")
    }

    const result = await Tickets.find({ creator: req.userId })
      .select("-creator -__v")
      .skip((pageNumber - 1) * ItemsPerPage)
      .limit(ItemsPerPage)
      .sort(dataSort)

    if (!result.length) {
      throw createError(404, "Seems empty", "Seems empty")
    }

    res.status(200).json({ tickets: result })
  } catch (error) {
    next(error)
  }
}
