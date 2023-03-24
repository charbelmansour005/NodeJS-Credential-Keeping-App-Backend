import { CredentialModel } from "../types/index.js"
import { Schema, model, Types } from "mongoose"

const credentialSchema = new Schema<CredentialModel>({
  title: {
    type: String,
    required: [true, "Please enter a title"],
  },
  key: {
    type: String,
    required: [true, "Please enter your key"],
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
  },
})

export const Credentials = model("Credentials", credentialSchema)
