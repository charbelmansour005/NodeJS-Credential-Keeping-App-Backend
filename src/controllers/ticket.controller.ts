import { TicketModel } from "../types/types.js"
import { Tickets } from "../models/ticket.model.js"
import { RequestHandler } from "express"
import { Status } from "../types/types.js"
import { createError } from "../utils/errorUtils.js"
import { ParsedQs } from "qs"
import { validationResult } from "express-validator"
import { User } from "../models/user.model.js"

const errorFormatter = ({ msg, param, value }: any) => {
  return {
    msg,
  }
}

const ItemsPerPage = 20
// ! try
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
    const client = await User.findOne({ _id: current_user })
    const { title, body } = req.body as TicketModel
    const createdDate = Date.now()

    if (!current_user) {
      throw createError(401, "Unauthorized", "Unauthorized")
    }

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

    if (isVip === true) {
      const clientTicket = new Tickets({
        title: title,
        body: body,
        createdDate: createdDate,
        status: Status.PENDING,
        creator: current_user,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        isVip: true,
      })
      await clientTicket.save()
    } else {
      const clientTicket = new Tickets({
        title: title,
        body: body,
        createdDate: createdDate,
        status: Status.PENDING,
        creator: current_user,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        isVip: false,
      })
      await clientTicket.save()
    }

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

// * ADMINS
// ! try

export const getClientTickets: RequestHandler = async (req, res, next) => {
  try {
    const vipTickets = await Tickets.find({ isVip: true })
    const nonVipTickets = await Tickets.find({ isVip: false })

    if (!vipTickets && !nonVipTickets) {
      throw createError(
        404,
        "Not found",
        "There does not seem to be any tickets at this time"
      )
    }

    const response = {
      vip: vipTickets.map((ticket) => ({
        title: ticket.title,
        body: ticket.body,
        createdDate: ticket.createdDate,
        status: ticket.status,
        user: ticket.user,
      })),
      nonVip: nonVipTickets.map((ticket) => ({
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
