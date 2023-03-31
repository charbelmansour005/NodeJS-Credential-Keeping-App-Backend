import { CredentialModel } from "../types/types.js"
import { RequestHandler } from "express"
import { updateCredential } from "../services/credentials/shared/updateCredential.service.js"
import { filterCreds } from "../services/credentials/shared/filterCreds.service.js"
import { addCred } from "../services/credentials/shared/addCred.service.js"
import { getCreds } from "../services/credentials/shared/getCreds.service.js"
import { deleteCred } from "../services/credentials/shared/deleteCred.service.js"
import { getAllCredentials } from "../services/credentials/admin/getAllCredentials.service.js"
import { getCredentialunAuth } from "../services/credentials/admin/getCredentialunAuth.service.js"
import { ParsedQs } from "qs"
import { validationResult } from "express-validator"
import { createError } from "../utils/errorUtils.js"

const errorFormatter = ({ value, msg, param, location }: any) => {
  return {
    msg,
  }
}

const ItemsPerPage = 20

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

    const { page, sort }: ParsedQs = req.query

    const pageNumber = Number(page)
    const dataSort = String(sort)

    const credentials = await getCreds(
      current_user,
      ItemsPerPage,
      pageNumber,
      dataSort
    )

    return res.status(200).json(credentials)
  } catch (error) {
    next(error)
  }
}

export const addUserCred: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }

    const credential = req.body as CredentialModel

    const current_user = req.userId as string | unknown

    const result = await addCred(current_user, credential)

    res.status(201).json({
      message: "Credential created successfully",
      details: result,
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
      details: removedCredential,
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserCredential: RequestHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
      throw createError(
        422,
        "Validation Error",
        errors
          .array()
          .map((error) => " " + error.msg)
          .toString()
          .trim()
      )
    }

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

// * ADMINS

export const getCredentials: RequestHandler = async (req, res, next) => {
  try {
    const { page, sort }: ParsedQs = req.query

    const pageNumber = Number(page)
    const dataSort = String(sort)

    const result = await getAllCredentials(pageNumber, dataSort, ItemsPerPage)

    return res.status(200).json({ allCredentials: result })
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
