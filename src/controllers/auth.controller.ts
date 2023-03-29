import { RequestHandler } from "express"
import { UserModel } from "../types/types.js"
import { changePass } from "../services/changePass.service.js"
import { register } from "../services/register.service.js"
import { login } from "../services/login.service.js"
import { getRoleService } from "../services/getRole.service.js"
import { User } from "../models/user.model.js"
import { createError } from "../utils/errorUtils.js"
import { transporter } from "../services/register.service.js"
import bcryptjs from "bcryptjs"

const { hash } = bcryptjs

export const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const loginBody = req.body as UserModel

    const result = await login(loginBody)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const current_user = req.userId

    const userBody = req.body as UserModel

    await changePass(current_user, userBody)

    res.status(200).json({ message: "Password changed successfully" })
  } catch (error) {
    next(error)
  }
}

export const putRegister: RequestHandler = async (req, res, next) => {
  try {
    const registerBody = req.body as UserModel

    const result = await register(registerBody)

    return res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const getRole: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization")

    const result = await getRoleService(authHeader)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

// * ADMIN

export const updateAnyUserPassword: RequestHandler = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body as UserModel

    if (!email || !newPassword) {
      throw createError(
        404,
        "Missing elements",
        "Please provide the client's email and a new password"
      )
    }

    const userToUpdate = await User.findOne({ email: email })

    if (!userToUpdate) {
      throw createError(
        404,
        "Not Found",
        "Could not find the user you are trying to update"
      )
    }

    const hashedPassword = await hash(newPassword, 12)

    userToUpdate.password = hashedPassword

    transporter.sendMail({
      to: email,
      from: "employees@node-complete.com",
      subject: "Password Change Request",
      html: `
      <h1>Password Updated</h1>\n
      <h3>Your new password was updated by as per your request.</h3>\n
      <p>New Password: <strong>${newPassword}</strong><p>
      <p>Thank you for choosing us and we hope we were able to help you out.</p>
      `,
    })

    await userToUpdate.save()

    res.status(200).json({ message: "Password changed by an Admin!" })
  } catch (error) {
    next(error)
  }
}
