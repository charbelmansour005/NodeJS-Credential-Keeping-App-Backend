import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import { requestPassword } from "../controllers/passGenerator.controller.js"

const router = Router()

router.post("/generatepassword", isAuth, requestPassword)

export default router
