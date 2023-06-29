import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import { requestPassword } from "../controllers/passGenerator.controller.js"
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
})
//test
const router = Router()

router.post("/generatepassword", isAuth, limiter, requestPassword)

export default router
