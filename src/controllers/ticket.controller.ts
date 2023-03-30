import { TicketModel } from "../types/types.js"
import { Tickets } from "../models/ticket.model.js"
import { RequestHandler } from "express"
import { Status } from "../types/types.js"
import { createError } from "../utils/errorUtils.js"
import { ParsedQs } from "qs"
import { validationResult } from "express-validator"
import { createTicketService } from "../services/tickets/shared/createTicket.service.js"
import { getMyTicketsService } from "../services/tickets/shared/getMyTickets.service.js"

const errorFormatter = ({ msg, param, value }: any) => {
  return {
    msg,
  }
}

const ItemsPerPage = 20

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

    const vipTickets = await Tickets.find({ isVip: true }).sort(dataSort)
    const nonVipTickets = await Tickets.find({ isVip: false }).sort(dataSort)

    if (!vipTickets && !nonVipTickets) {
      throw createError(
        404,
        "Not found",
        "There does not seem to be any tickets at this time"
      )
    }

    const response = {
      vip: vipTickets.map((ticket) => ({
        _id: ticket._id,
        title: ticket.title,
        body: ticket.body,
        createdDate: ticket.createdDate,
        status: ticket.status,
        user: ticket.user,
      })),
      nonVip: nonVipTickets.map((ticket) => ({
        _id: ticket._id,
        title: ticket.title,
        body: ticket.body,
        createdDate: ticket.createdDate,
        status: ticket.status,
        user: ticket.user,
      })),
    }

    res.status(200).json(response)
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

    const current_user = req.userId

    if (!current_user) {
      throw createError(401, "Unauthorized", "Unauthorized")
    }

    const { ticketId } = req.params

    const ticketToUpdate = await Tickets.findOne({ _id: ticketId })

    const { status } = req.body as TicketModel

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

    res.status(200).json({ message: "Ticket status updated.", details: result })
  } catch (error) {
    next(error)
  }
}
