import { RequestHandler } from "express"
import { UserModel } from "../types/types.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken, { JwtPayload } from "jsonwebtoken"
import { createError } from "../utils/errorUtils.js"
import { changePass } from "../services/changePass.service.js"
import { register } from "../services/register.service.js"
import { login } from "../services/login.service.js"

const { verify } = jsonwebtoken

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
    if (!authHeader) {
      throw createError(401, "Unauthenticated", "Unauthenticated")
    }
    const access_token = authHeader.split(" ")[1]
    let decodedToken: string | JwtPayload
    try {
      decodedToken = verify(access_token, process.env.SECRET as string) as {
        role: string
      }
      res.status(200).json({ role: decodedToken.role })
    } catch (err) {
      console.log(err)
    }
  } catch (error) {
    next(error)
  }
}
