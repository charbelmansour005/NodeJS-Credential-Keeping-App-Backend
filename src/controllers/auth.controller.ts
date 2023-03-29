import { RequestHandler } from "express"
import { UserModel } from "../types/types.js"
import { changePass } from "../services/auth/changePass.service.js"
import { register } from "../services/auth/register.service.js"
import { login } from "../services/auth/login.service.js"
import { getRoleService } from "../services/auth/getRole.service.js"
import { updateAnyUserPass } from "../services/auth/updateAnyUserPass.service.js"

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
    const resetPasswordBody = req.body as UserModel

    const result = await updateAnyUserPass(resetPasswordBody)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
