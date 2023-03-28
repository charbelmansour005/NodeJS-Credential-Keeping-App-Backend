import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import {
  postLogin,
  putSignUp,
  changePassword,
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/login", postLogin)
router.put("/register", putSignUp)
router.put("/changepassword", isAuth, changePassword)

export default router
