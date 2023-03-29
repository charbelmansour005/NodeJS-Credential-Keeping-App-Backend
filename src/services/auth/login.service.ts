import { User } from "../../models/user.model.js"
import { UserModel } from "../../types/types.js"
import bcryptjs from "bcryptjs"
import { createError } from "../../utils/errorUtils.js"
import jsonwebtoken from "jsonwebtoken"

const { compare } = bcryptjs
const { sign } = jsonwebtoken

export async function login(loginBody: UserModel) {
  const { email, password } = loginBody

  const user = await User.findOne({ email: email })

  if (!user) {
    throw createError(
      401,
      "Not found",
      "A user with this email could not be found"
    )
  }

  const isEqual = await compare(password, user.password)

  if (!isEqual) {
    throw createError(401, "Invalid Credentials", "Wrong email or password")
  }

  await User.findOneAndUpdate({ email: email }, { logoutAll: false })

  let loadedUser: unknown | any
  loadedUser = user

  const token = sign(
    {
      email: loadedUser.email,
      userId: loadedUser._id.toString(),
      role: loadedUser.role.toString(),
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  )

  return {
    token: token,
  }
}
