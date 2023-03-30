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
import { credentialValidations } from "../validations/credentials/credentiatValidations.js"

const router = Router()

router.get("/mine", isAuth, getUserCreds)
router.get("/credential", isAuth, filterUserCreds)
router.post("/credential", credentialValidations, isAuth, addUserCred)
router.put(
  "/credential/:credId",
  credentialValidations,
  isAuth,
  updateUserCredential
)
router.delete("/credential/:credId", isAuth, deleteUserCred)

// * ADMINS

router.get("/admin/all", isAuth, isAdmin, getCredentials)
router.get("/admin/credential/:credId", isAuth, isAdmin, getCredential)

export default router
