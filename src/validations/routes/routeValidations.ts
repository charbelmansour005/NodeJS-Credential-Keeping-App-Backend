import { check } from "express-validator"

const routeValidations = [
  check("path")
    .isString()
    .withMessage("Path must be a string")
    .notEmpty()
    .withMessage("'Path' field must not be empty"),
  check("enabled")
    .isNumeric()
    .withMessage("Enabled must be 0 or 1")
    .notEmpty()
    .withMessage("'Enabled' field must not be empty"),
]

export { routeValidations }
