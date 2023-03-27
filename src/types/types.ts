import { Types } from "mongoose"

type UserModel = {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: number
}

type CredentialModel = {
  title: string
  key: string
  creator: Types.ObjectId | unknown
  created_At: Date
  updated_At: Date
}

export type { UserModel, CredentialModel }
