import { Types, Schema, model } from "mongoose"
import { Status, TicketModel } from "../types/types.js"

const ticketSchema = new Schema<TicketModel>({
  title: {
    type: String,
    required: [true, "Please give your ticket a title."],
    maxlength: [25, "Ticket title cannot have more than 25 characters"],
    minlength: [2, "Ticket title has to have at least 2 characters"],
  },

  body: {
    type: String,
    required: [true, "Please give your ticket a title."],
    maxlength: [400, "Ticket body cannot have more than 250 characters"],
    minlength: [2, "Ticket body has to have at least 2 characters"],
  },

  status: {
    type: String,
    required: true,
    default: Status.PENDING,
  },

  isVip: {
    type: Boolean,
    required: true,
    default: false,
  },

  createdDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  creator: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },

  user: {
    type: Object,
    required: true,
  },
})

export const Tickets = model("Tickets", ticketSchema)
