import { routeValidations } from "../validations/routes/routeValidations.js"
import {
  add_FE_Routes,
  get_FE_Routes,
} from "../controllers/route.controller.js"
import { Router } from "express"
import { isAuth } from "../middleware/isAuth.middleware.js"
import { isAdmin } from "../middleware/isAdmin.middleware.js"

const router = Router()

router.get("/routes", get_FE_Routes)
router.post("/routes", routeValidations, isAuth, isAdmin, add_FE_Routes)

export default router
