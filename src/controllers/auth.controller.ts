import { RequestHandler } from "express"
import { UserModel } from "../types/types.js"
import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import nodemailer from "nodemailer"
import { createError } from "../utils/errorUtils.js"

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
})

const { hash, compare } = bcryptjs
const { sign } = jsonwebtoken

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
    const { email, password, newPassword } = req.body as UserModel

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

    const user = await User.findOneAndUpdate(
      { _id: current_user, email: email },
      { logoutAll: true },
      { new: true }
    )

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

    const hashedPassword = await hash(newPassword, 12)

    const pass_updated_At = new Date()

    user.password = hashedPassword
    user.pass_updated_At = pass_updated_At
    await user.save()

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
        "A user with this phone number already exists"
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
