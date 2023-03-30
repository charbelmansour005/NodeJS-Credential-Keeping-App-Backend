import { Types, Document } from "mongoose"

type UserModel = Document & {
  email: string
  password: string
  newPassword?: string
  firstName: string
  logoutAll?: boolean
  lastName: string
  phoneNumber: number
  registeredAt: Date
  pass_updated_At: Date
  role: string
  isVip: boolean
}

type CredentialModel = Document & {
  title: string
  email?: string
  key: string
  creator: Types.ObjectId | unknown
  created_At: Date
  updated_At: Date
}

enum Status {
  PENDING = "pending",
  INPROGRESS = "inprogress",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

type TicketModel = Document & {
  title: string
  body: string
  status: string
  createdDate: Date
  creator: Types.ObjectId | unknown
}

export type { UserModel, CredentialModel, TicketModel }
export { Status }
