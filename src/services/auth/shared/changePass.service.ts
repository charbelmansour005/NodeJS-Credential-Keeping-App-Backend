import bcryptjs from "bcryptjs"
import { User } from "../../../models/user.model.js"
import { UserModel } from "../../../types/types.js"
import { createError } from "../../../utils/errorUtils.js"

const { hash, compare } = bcryptjs

export async function changePass(
  current_user: string | unknown,
  userBody: UserModel
) {
  const { email, password, newPassword } = userBody
  if (!current_user) {
    throw createError(401, "Unauthorized", "Please sign in first")
  }

  if (!email || !password || !newPassword) {
    throw createError(
      404,
      "Missing fields",
      "Please provide all necessary credentials to change your password"
    )
  }

  const user = await User.findOne({ _id: current_user, email: email })

  if (!user) {
    throw createError(
      401,
      "Unauthorized",
      "Could not find a user with your identity in our database"
    )
  }

  const isEqual = await compare(password, user.password)

  if (!isEqual) {
    throw createError(401, "Unauthorized", "Old password is incorrent")
  }

  const pipeline = [{ $set: { logoutAll: true } }, { $set: { new: true } }]

  await User.updateOne({ _id: current_user, email: email }, pipeline)

  const hashedPassword = await hash(newPassword, 12)

  const pass_updated_At = new Date()

  user.password = hashedPassword
  user.pass_updated_At = pass_updated_At
  await user.save()
}
