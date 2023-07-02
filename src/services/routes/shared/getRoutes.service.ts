import { Routes } from "../../../models/routes.model.js"
import { createError } from "../../../utils/errorUtils.js"

export const getRoutes = async () => {
  const routes = await Routes.find().select("-__v")

  if (routes.length === 0) {
    throw createError(
      404,
      "Not found",
      "You don't have any secured credentials yet. Start by adding some."
    )
  }

  return routes
}
