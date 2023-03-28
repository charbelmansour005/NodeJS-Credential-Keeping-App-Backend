import {
  getCredential,
  getCredentials,
  getUserCreds,
  addUserCred,
  deleteUserCred,
  updateUserCredential,
  filterUserCreds,
} from "../controllers/credential.controller.js"
import { isAuth } from "../middleware/isAuth.middleware.js"
import { Router } from "express"

const router = Router()

router.get("/mine", isAuth, getUserCreds)
router.get("/credential", isAuth, filterUserCreds)
router.post("/credential", isAuth, addUserCred)
router.put("/:credId", isAuth, updateUserCredential)
router.delete("/:credId", isAuth, deleteUserCred)

// extra routes - (unauthenticated routes)
router.get("/", getCredentials)
router.get("/:credId", getCredential)

export default router
