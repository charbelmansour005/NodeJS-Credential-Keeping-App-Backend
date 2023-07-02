import { RouteModel } from "../types/types.js"
import { Schema, model, Types } from "mongoose"

const routeSchema = new Schema<RouteModel>({
  path: {
    type: String,
    trim: true,
  },

  enabled: {
    type: Boolean,
  },
})

export const Routes = model("Route", routeSchema)
