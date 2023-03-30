import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import {
  createTicket,
  getMyTickets,
  getClientTickets,
} from "../controllers/ticket.controller.js"
import { ticketValidations } from "../validations/tickets/ticketValidations.js"
import { isAdmin } from "../middleware/isAdmin.middleware.js"

const router = Router()

router
  .route("/ticket")
  .post(ticketValidations, isAuth, createTicket)
  .get(ticketValidations, isAuth, getMyTickets)
// * admin
router.get("/tickets/clients", isAuth, isAdmin, getClientTickets)

export default router
