import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import { isAdmin } from "../middleware/isAdmin.middleware.js"
import {
  changePasswordValidations,
  registerValidations,
  banUserValidations,
} from "../validations/auth/authValidations.js"
import {
  postLogin,
  putRegister,
  changePassword,
  getRole,
  updateAnyUserPassword,
  banUserAccounts,
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/login", postLogin)
router.post("/register", registerValidations, putRegister)
router.patch(
  "/changepassword",
  changePasswordValidations,
  isAuth,
  changePassword
)
router.get("/whoami", isAuth, getRole)

// * ADMIN

router.patch(
  "/admin/changepassword",
  changePasswordValidations,
  isAuth,
  isAdmin,
  updateAnyUserPassword
)

router.patch(
  "/ban/:userId",
  banUserValidations,
  isAuth,
  isAdmin,
  banUserAccounts
)

export default router
