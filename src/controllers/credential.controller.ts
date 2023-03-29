import { Credentials } from "../models/credential.model.js"
import { CredentialModel } from "../types/types.js"
import { RequestHandler } from "express"
import { updateCredential } from "../services/updateCredential.service.js"
import { getCredentialunAuth } from "../services/getCredentialunAuth.service.js"
import { filterCreds } from "../services/filterCreds.service.js"
import { addCred } from "../services/addCred.service.js"
import { getCreds } from "../services/getCreds.service.js"
import { deleteCred } from "../services/deleteCred.service.js"

export const filterUserCreds: RequestHandler = async (req, res, next) => {
  try {
    const current_user = req.userId
    const { title } = req.query

    const queryResults = await filterCreds(current_user, title)

    res.status(200).json(queryResults)
  } catch (error) {
    next(error)
  }
}

export const getUserCreds: RequestHandler = async (req, res, next) => {
  try {
    const current_user = req.userId as string | unknown

    const credentials = await getCreds(current_user)

    return res.status(200).json(credentials)
  } catch (error) {
    next(error)
  }
}

export const addUserCred: RequestHandler = async (req, res, next) => {
  try {
    const credential = req.body as CredentialModel

    const current_user = req.userId as string | unknown

    const result = await addCred(current_user, credential)

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
    const current_user = req.userId

    const removedCredential = await deleteCred(credId, current_user)

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
    const credential = req.body as CredentialModel

    const result = await updateCredential(req.userId, credId, credential)

    res.status(200).json({
      message: `Success! Updated Credential`,
      updatedTitle: result.updatedTitle,
      updatedKey: result.updatedKey,
    })
  } catch (error) {
    next(error)
  }
}

// for unauthorized access

export const getCredentials: RequestHandler = async (req, res, next) => {
  try {
    const credentials = await Credentials.find()
    // ! add pagination
    return res.status(200).json({ AllCredentials: credentials })
  } catch (error) {
    next(error)
  }
}

export const getCredential: RequestHandler = async (req, res, next) => {
  try {
    const { credId } = req.params

    const requesedCredential = await getCredentialunAuth(credId)

    return res.status(200).json({ requesedCredential: requesedCredential })
  } catch (error) {
    next(error)
  }
}
