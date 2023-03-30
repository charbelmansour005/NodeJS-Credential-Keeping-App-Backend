import { Types, Schema, model } from "mongoose"
import { Status, TicketModel } from "../types/types.js"

const ticketSchema = new Schema<TicketModel>({
  title: {
    type: String,
    required: [true, "Please give your ticket a title."],
    maxlength: [25, "Ticket title cannot be more than 25 characters"],
  },

  body: {
    type: String,
    required: [true, "Please give your ticket a title."],
    maxlength: [250, "Ticket body cannot be more than 250 characters"],
  },

  status: {
    type: String,
    required: true,
    default: Status.PENDING,
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
})

export const Tickets = model("Tickets", ticketSchema)
