import { Types, Document } from "mongoose"

type UserModel = Document & {
  email: string
  password: string
  newPassword?: string
  firstName: string
  logoutAll?: boolean
  lastName: string
  phoneNumber: number
  signedUp_At: Date
  pass_updated_At: Date
}

type CredentialModel = Document & {
  title: string
  key: string
  creator: Types.ObjectId | unknown
  created_At: Date
  updated_At: Date
}

export type { UserModel, CredentialModel }
