import { CredentialModel } from "../types/types.js"
import { Schema, model, Types } from "mongoose"

const credentialSchema = new Schema<CredentialModel>({
  title: {
    type: String,
    required: [true, "Please enter a title for your key"],
  },

  key: {
    type: String,
    required: [true, "Please enter your key"],
    minlength: [8, "A secure password must be at least 8 characters"],
  },

  creator: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },

  created_At: {
    type: Date,
    required: true,
    default: Date.now(),
    select: false,
  },

  updated_At: {
    type: Date,
    required: true,
    default: Date.now(),
    select: false,
  },
})

export const Credentials = model("Credentials", credentialSchema)
