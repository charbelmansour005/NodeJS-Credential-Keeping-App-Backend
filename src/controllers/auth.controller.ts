import { RequestHandler } from "express"
import { UserModel } from "../types/types.js"
import { changePass } from "../services/auth/shared/changePass.service.js"
import { register } from "../services/auth/client/register.service.js"
import { login } from "../services/auth/shared/login.service.js"
import { getRoleService } from "../services/auth/shared/getRole.service.js"
import { updateAnyUserPass } from "../services/auth/admin/updateAnyUserPass.service.js"
import { createError } from "../utils/errorUtils.js"
import { validationResult } from "express-validator"
import { User } from "../models/user.model.js"
import { banAnyUserService } from "../services/auth/admin/banAnyUser.service.js"

const errorFormatter = ({ value, msg, param, location }: any) => {
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
      console.log(errors)
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

// * Admins

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

export const banUserAccounts: RequestHandler = async (req, res, next) => {
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

    const { userId } = req.params

    const result = await banAnyUserService(userId)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getAllUserAccounts: RequestHandler = async (req, res, next) => {
  try {
    const current_user = req.userId

    if (!current_user) {
      throw createError(401, "Unauth", "Unauth")
    }

    const pipeline = [
      { $match: { role: { $in: ["user", "admin"] } } },
      {
        $group: {
          _id: "$role",
          users: {
            $push: {
              _id: "$_id",
              email: "$email",
              firstName: "$firstName",
              lastName: "$lastName",
              phoneNumber: "$phoneNumber",
              isBanned: "$isBanned",
              registeredAt: "$registeredAt",
              pass_updated_At: "$pass_updated_At",
              role: "$role",
            },
          },
        },
      },
    ]

    const usersByRole = await User.aggregate(pipeline)

    if (!usersByRole.length) {
      throw createError(404, "Not Found", "We could not find any users")
    }

    const response = {}
    usersByRole.forEach((role) => {
      response[role._id] = role.users
    })

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
