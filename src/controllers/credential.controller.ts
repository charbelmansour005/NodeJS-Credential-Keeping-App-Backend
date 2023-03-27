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

    const requestedCredential = await Credentials.findById(credId)

    if (!req.userId) {
      const error: ErrorResponse = {
        message: "User not found",
        name: "Not found",
        status: 404,
      }
      throw error
    } else if (!requestedCredential) {
      const error: ErrorResponse = {
        message: "Credential not found",
        name: "Not found",
        status: 404,
      }
      throw error
    } else if (
      requestedCredential?.creator?.toString() !== req.userId.toString()
    ) {
      const error: ErrorResponse = {
        message: "Unauthorized",
        name: "Unauthorized",
        status: 401,
      }
      throw error
    }

    const removedCredential = await Credentials.findByIdAndRemove(credId)

    return res.status(200).json({
      message: `Credential deleted`,
      deletedCredential: removedCredential,
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserCredential: RequestHandler = async (req, res, next) => {
  try {
    const { credId } = req.params

    const { title, key } = req.body as CredentialModel
    const updated_At = new Date()

    const requestedCredential = await Credentials.findById(credId)

    if (!requestedCredential) {
      const error: ErrorResponse = {
        message: "Requested credential not found",
        name: "Not found",
        status: 404,
      }
      throw error
    } else if (
      requestedCredential?.creator?.toString() !== req.userId.toString()
    ) {
      const error: ErrorResponse = {
        message: "Unauthorized",
        name: "Unauthorized",
        status: 401,
      }
      throw error
    } else if (!title || !key) {
      const error: ErrorResponse = {
        message: "Please fill all required fields",
        name: "Missing fields",
        status: 404,
      }
      throw error
    }

    requestedCredential.title = title
    requestedCredential.key = key
    requestedCredential.updated_At = updated_At

    const result = await requestedCredential.save()

    res.status(200).json({
      message: `Success! Updated Credential`,
      updatedTitle: result.title,
      updatedKey: result.key,
    })
  } catch (error) {
    next(error)
  }
}

// unauthorized access

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
