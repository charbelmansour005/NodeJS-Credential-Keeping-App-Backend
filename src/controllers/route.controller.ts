import type { RequestHandler } from "express"
import { getRoutes } from "../services/routes/shared/getRoutes.service.js"
import { validationResult } from "express-validator"
import { createError } from "../utils/errorUtils.js"
import { RouteModel } from "../types/types.js"
import { addRoute } from "../services/routes/shared/addRoutes.service.js"

const errorFormatter = ({ value, msg, param, location }: any) => {
  return {
    msg,
  }
}

export const get_FE_Routes: RequestHandler = async (req, res, next) => {
  try {
    const routes = await getRoutes()

    return res.status(200).json(routes)
  } catch (error) {
    next(error)
  }
}

export const add_FE_Routes: RequestHandler = async (req, res, next) => {
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

    const route = req.body as RouteModel

    const result = await addRoute(route)

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}
