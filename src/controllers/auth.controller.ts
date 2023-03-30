import { RequestHandler } from "express"
import { UserModel } from "../types/types.js"
import { changePass } from "../services/auth/changePass.service.js"
import { register } from "../services/auth/client/register.service.js"
import { login } from "../services/auth/login.service.js"
import { getRoleService } from "../services/auth/getRole.service.js"
import { updateAnyUserPass } from "../services/auth/admin/updateAnyUserPass.service.js"
import { createError } from "../utils/errorUtils.js"
import { validationResult } from "express-validator"

const errorFormatter = ({ msg, param, value }: any) => {
  return {
    msg,
  }
}

export const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }

    const loginBody = req.body as UserModel
    const result = await login(loginBody)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }

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
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }

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
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }

    const resetPasswordBody = req.body as UserModel

    const result = await updateAnyUserPass(resetPasswordBody)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
