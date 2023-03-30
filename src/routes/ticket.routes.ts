import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import { createTicket, getMyTickets } from "../controllers/ticket.controller.js"

const router = Router()

router.route("/ticket").post(isAuth, createTicket).get(isAuth, getMyTickets)

export default router
