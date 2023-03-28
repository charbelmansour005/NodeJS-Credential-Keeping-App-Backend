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
import { isAdmin } from "../middleware/isAdmin.middleware.js"

const router = Router()

router.get("/mine", isAuth, getUserCreds)
router.get("/credential", isAuth, filterUserCreds)
router.post("/credential", isAuth, addUserCred)
router.put("/:credId", isAuth, updateUserCredential)
router.delete("/:credId", isAuth, deleteUserCred)

// extra routes - (admin routes)

router.get("/", isAuth, isAdmin, getCredentials)
router.get("/:credId", isAuth, isAdmin, getCredential)

export default router
