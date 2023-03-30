import { User } from "../../models/user.model.js"
import { v4 as uuidv4 } from "uuid"
import { createError } from "../../utils/errorUtils.js"

export async function generatePass(current_user: string | unknown) {
  const foundUser = await User.findOne({ _id: current_user })
  if (!foundUser) {
    throw createError(404, "Not found", "User not found")
  }
  const generatedPassword = uuidv4()
  return {
    generatedPassword,
  }
}
