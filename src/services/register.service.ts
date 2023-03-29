import { UserModel } from "../types/types.js"
import { createTransport } from "nodemailer"
import { createError } from "../utils/errorUtils.js"
import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"

const { hash } = bcryptjs

var transporter = createTransport({
  service: "gmail",
  auth: {
    user: "charbelmansour005@gmail.com",
    pass: "encxvodkkuczlxdv",
  },
})

export async function register(registerBody: UserModel) {
  const { email, password, firstName, lastName, phoneNumber } = registerBody
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
    email: registeredPhoneNumber,
    phoneNumber: registeredEmail,
  }
}
