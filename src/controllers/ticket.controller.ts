import { TicketModel } from "../types/types.js"
import { RequestHandler } from "express"
import { createError } from "../utils/errorUtils.js"
import { ParsedQs } from "qs"
import { validationResult } from "express-validator"
import { createTicketService } from "../services/tickets/shared/createTicket.service.js"
import { getMyTicketsService } from "../services/tickets/shared/getMyTickets.service.js"
import { getClientTicketsService } from "../services/tickets/admin/getClientTickets.service.js"
import { updateClientTicketsService } from "../services/tickets/admin/updateClientTickets.service.js"

const errorFormatter = ({ value, msg, param, location }: any) => {
  return {
    msg,
  }
}

export const createTicket: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }
    const current_user = req.userId
    const ticketBody = req.body as TicketModel

    await createTicketService(current_user, ticketBody)

    res.status(201).json({
      message: "Ticket created successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const getMyTickets: RequestHandler = async (req, res, next) => {
  try {
    const { page, sort }: ParsedQs = req.query
    const current_user = req.userId
    const pageNumber = Number(page)
    const dataSort = String(sort)

    const result = await getMyTicketsService(pageNumber, dataSort, current_user)

    res.status(200).json({ tickets: result })
  } catch (error) {
    next(error)
  }
}

// * ADMINS

export const getClientTickets: RequestHandler = async (req, res, next) => {
  try {
    const { sort }: ParsedQs = req.query

    const dataSort = String(sort)

    const result = await getClientTicketsService(dataSort)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const updateClientTicket: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }

    const { ticketId } = req.params
    const current_user = req.userId
    const updateTicketBody = req.body as TicketModel

    const result = await updateClientTicketsService(
      ticketId,
      current_user,
      updateTicketBody
    )

    res.status(200).json({ message: "Ticket status updated.", details: result })
  } catch (error) {
    next(error)
  }
}
