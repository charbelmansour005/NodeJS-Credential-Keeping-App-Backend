import { Schema, model } from "mongoose"
import { UserModel } from "../types/types.js"

const userSchema = new Schema<UserModel>({
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    lowercase: true,
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: 13,
  },

  firstName: {
    type: String,
    required: [false, "Please enter your first name"],
  },

  logoutAll: {
    type: Boolean,
    required: false,
  },

  lastName: {
    type: String,
    required: [false, "Please enter your first name"],
  },

  phoneNumber: {
    type: Number,
    required: [false, "Please enter your phone number"],
  },

  signedUp_At: {
    type: Date,
    required: true,
    default: Date.now(),
    select: false,
  },

  pass_updated_At: {
    type: Date,
    required: true,
    default: Date.now(),
    select: false,
  },
})

export const User = model<UserModel>("User", userSchema)
