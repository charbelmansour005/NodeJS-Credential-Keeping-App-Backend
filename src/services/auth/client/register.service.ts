import { UserModel } from "../../../types/types.js"
import { createError } from "../../../utils/errorUtils.js"
import { User } from "../../../models/user.model.js"
import { transporter } from "../../../helper/transporter.js"
import bcryptjs from "bcryptjs"

const { hash } = bcryptjs

export async function register(registerBody: UserModel) {
  const { email, password, firstName, lastName, phoneNumber, isVip } =
    registerBody
  const user = await User.findOne({ email: email })

  const dateOfSignUp = new Date()

  if (user) {
    throw createError(
      409,
      "Already exists",
      "A user with this email already exists"
    )
  }

  const users = await User.find({ phoneNumber: phoneNumber })

  if (users.length !== 0) {
    throw createError(
      409,
      "Already exists",
      "A user with this phone number already exists!"
    )
  }

  const hashedPassword = await hash(password, 12)

  const authenticatedUser = new User({
    email: email,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    password: hashedPassword,
    signedUp_at: dateOfSignUp,
    isVip: isVip,
  })

  transporter.sendMail({
    to: email,
    from: "employees@node-complete.com",
    html: "<h1>Welcome! Thank you for choosing us.</h1>",
  })

  const result = await authenticatedUser.save()
  const registeredPhoneNumber = result.phoneNumber
  const registeredEmail = result.email

  return {
    message: "Sign up success",
    email: registeredEmail,
    phoneNumber: registeredPhoneNumber,
  }
}
