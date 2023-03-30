import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import {
  createTicket,
  getMyTickets,
  getClientTickets,
  updateClientTicket,
} from "../controllers/ticket.controller.js"
import {
  ticketUpdateValidations,
  ticketValidations,
} from "../validations/tickets/ticketValidations.js"
import { isAdmin } from "../middleware/isAdmin.middleware.js"

const router = Router()

router
  .route("/ticket")
  .post(ticketValidations, isAuth, createTicket)
  .get(ticketValidations, isAuth, getMyTickets)

// * admin
router.get("/tickets/clients", isAuth, isAdmin, getClientTickets)
router.put(
  "/ticket/:ticketId",
  ticketUpdateValidations,
  isAuth,
  isAdmin,
  updateClientTicket
)

export default router
