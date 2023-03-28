import { RequestHandler } from "express"
import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { ErrorResponse } from "../index.js"
import nodemailer from "nodemailer"
import { UserModel } from "../types/types.js"

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "charbelmansour005@gmail.com",
    pass: "encxvodkkuczlxdv",
  },
})

const { hash, compare } = bcryptjs
const { sign } = jsonwebtoken

export const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { password, email } = req.body

    const user = await User.findOne({ email: email })

    if (!user) {
      const error: ErrorResponse = {
        status: 401,
        name: "Not found",
        message: "A user with this email could not be found",
      }
      throw error
    }

    const isEqual = await compare(password, user.password)

    if (!isEqual) {
      const error: ErrorResponse = {
        status: 401,
        name: "Invalid",
        message: "The credentials you provided are invalid",
      }
      throw error
    }

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
      const error: ErrorResponse = {
        status: 401,
        name: "Unauthorized",
        message: "Please sign in first",
      }
      throw error
    }

    // Find the user document that matches the current user's ID
    const user = await User.findOne({ email: email, _id: current_user })

    if (!user) {
      const error: ErrorResponse = {
        status: 401,
        name: "Unauthorized",
        message: "Could not find a user with your identity in our database",
      }
      throw error
    }

    const isEqual = await compare(password, user.password)

    if (!isEqual) {
      const error: ErrorResponse = {
        status: 401,
        name: "Unauthorized",
        message: "Old password is incorrent",
      }
      throw error
    }

    const hashedPassword = await hash(newPassword, 12)

    user.password = hashedPassword
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
      const error: ErrorResponse = {
        status: 409,
        name: "Already exists",
        message: "A user with this email already exists",
      }
      throw error
    }

    const users = await User.find({ phoneNumber: phoneNumber })

    if (users.length !== 0) {
      const error: ErrorResponse = {
        status: 409,
        name: "Already exists",
        message: "A user with this phone number already exists",
      }
      throw error
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
