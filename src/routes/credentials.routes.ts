import {
  getCredential,
  getCredentials,
  addUserCred,
  deleteUserCred,
} from "../controllers/credential.controller.js"
import { isAuth } from "../middleware/isAuth.js"
import { Router } from "express"

const router = Router()

router.get("/:credId", getCredential)
router.get("/", getCredentials)

router.post("/credential", isAuth, addUserCred)
router.delete("/credential", isAuth, deleteUserCred)

export default router
