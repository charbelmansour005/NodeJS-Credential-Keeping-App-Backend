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

  lastName: {
    type: String,
    required: [false, "Please enter your last name"],
  },

  phoneNumber: {
    type: Number,
    required: [false, "Please enter your phone number"],
  },

  isVip: {
    type: Boolean,
    required: true,
    default: false,
  },

  isBanned: {
    type: Boolean,
    required: true,
    default: false,
  },

  registeredAt: {
    type: Date,
    required: true,
    default: Date.now(),
    select: false,
  },

  logoutAll: {
    type: Boolean,
    required: false,
  },

  pass_updated_At: {
    type: Date,
    required: true,
    default: Date.now(),
    select: false,
  },

  role: {
    type: String,
    default: "user",
    required: true,
    enum: ["user", "admin"],
  },
})

export const User = model<UserModel>("User", userSchema)
