import { RequestHandler } from "express"
import { UserModel } from "../types/types.js"
import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken, { JwtPayload } from "jsonwebtoken"
import nodemailer from "nodemailer"
import { createError } from "../utils/errorUtils.js"
import { changePass } from "../services/changePass.service.js"

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "charbelmansour005@gmail.com",
    pass: "encxvodkkuczlxdv",
  },
})

const { hash, compare } = bcryptjs
const { sign, verify } = jsonwebtoken

export const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { password, email } = req.body

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

    res.status(200).json({ token: token })
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

export const putSignUp: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } =
      req.body as UserModel

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

    return res.status(201).json({
      message: "Sign up success",
      email: result.email,
      phoneNumber: result.phoneNumber,
    })
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
