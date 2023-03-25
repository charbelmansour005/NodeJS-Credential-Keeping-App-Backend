import { Router } from "express"
import { postLogin, putSignUp } from "../controllers/auth.controller.js"

const router = Router()

router.post("/login", postLogin)
router.put("/signup", putSignUp)

export default router
