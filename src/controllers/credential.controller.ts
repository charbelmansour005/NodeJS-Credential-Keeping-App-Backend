import { Credentials } from "../models/credential.model.js"
import { User } from "../models/user.model.js"
import { CredentialModel } from "../types/types.js"
import { RequestHandler } from "express"
import { ErrorResponse } from "../index.js"

export const getUserCreds: RequestHandler = async (req, res, next) => {
  try {
    const current_user = req.userId
    const userCreds = await Credentials.find({ creator: current_user })

    if (!userCreds.length) {
      const error: ErrorResponse = {
        message: "Credential not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }

    return res.status(200).json({ credentials: userCreds })
  } catch (error) {
    next(error)
  }
}

export const addUserCred: RequestHandler = async (req, res, next) => {
  try {
    const { title, key } = req.body as CredentialModel

    const current_user = await User.findById(req.userId)

    if (!current_user) {
      const error: ErrorResponse = {
        message: "User not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }

    if (!title || !key) {
      const error: ErrorResponse = {
        message: "Both a key and a title must be provided",
        name: "Missing element",
        status: 404,
      }
      throw error
    }

    const newCredentialSet = await Credentials.create({
      title: title,
      key: key,
      creator: current_user,
    })

    const result = await newCredentialSet.save()

    res.status(201).json({
      message: "Credential created successfully",
      credential_details: result,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUserCred: RequestHandler = async (req, res, next) => {
  try {
    const { credId } = req.params

    const credential = await Credentials.findByIdAndRemove(credId)

    if (!req.userId) {
      const error: ErrorResponse = {
        message: "User not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }

    if (!credential) {
      const error: ErrorResponse = {
        message: "Credential not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }

    return res
      .status(200)
      .json({ message: `Order deleted`, deletedCredential: credential })
  } catch (error) {
    next(error)
  }
}

export const getCredentials: RequestHandler = async (req, res, next) => {
  try {
    const creds = await Credentials.find()
    return res.status(200).json({ creds: creds })
  } catch (error) {
    next(error)
  }
}

export const getCredential: RequestHandler = async (req, res, next) => {
  try {
    const { credId } = req.params
    const cred = await Credentials.findById(credId)

    if (!cred) {
      const error: ErrorResponse = {
        message: "Credential not found",
        name: "Not found",
        status: 404,
      }
      throw error
    }
    return res.status(200).json({ credential: cred })
  } catch (error) {
    next(error)
  }
}
