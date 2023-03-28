import { ErrorResponse } from "../index.js"
import { User } from "../models/user.model.js"
import { v4 as uuidv4 } from "uuid"

export async function generatePass(current_user: string | unknown) {
  const foundUser = await User.findOne({ _id: current_user })
  if (!foundUser) {
    const error: ErrorResponse = {
      message: "User not found",
      name: "Not found",
      status: 404,
    }
    throw error
  }
  const requestedPassword = uuidv4()
  return {
    requestedPassword,
  }
}
