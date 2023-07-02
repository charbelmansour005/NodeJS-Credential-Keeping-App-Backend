import { Routes } from "../../../models/routes.model.js"
import { RouteModel } from "../../../types/types.js"
import { createError } from "../../../utils/errorUtils.js"

export const addRoute = async (route: RouteModel) => {
  const { path, enabled } = route

  if (!path || !enabled) {
    throw createError(
      404,
      "Missing element",
      "Both 'path' and 'enabled' fields must be provided"
    )
  }

  const new_route = await Routes.create({
    path: path,
    enabled: enabled,
  })

  const result = await new_route.save()

  return {
    result,
  }
}
