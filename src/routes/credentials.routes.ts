import {
  getCredential,
  getCredentials,
  getUserCreds,
  addUserCred,
  deleteUserCred,
} from "../controllers/credential.controller.js"
import { isAuth } from "../middleware/isAuth.js"
import { Router } from "express"

const router = Router()

router.get("/mine", isAuth, getUserCreds)

router
  .route("/credential")
  .post(isAuth, addUserCred)
  .delete(isAuth, deleteUserCred)

// extra routes - unauthenticated - (very bad prone to hacks)
router.get("/", getCredentials)
router.get("/:credId", getCredential)

export default router
