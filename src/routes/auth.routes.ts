import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import { isAdmin } from "../middleware/isAdmin.middleware.js"
import {
  postLogin,
  putRegister,
  changePassword,
  getRole,
  updateAnyUserPassword,
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/login", postLogin)
router.put("/register", putRegister)
router.put("/changepassword", isAuth, changePassword)
router.get("/whoami", isAuth, getRole)

// * ADMIN

router.put("/admin/changepassword", isAuth, isAdmin, updateAnyUserPassword)

export default router
