import { check } from "express-validator"

const credentialValidations = [
  check("email").toLowerCase().trim(),
  check("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title must not be empty"),
  check("key")
    .isString()
    .withMessage("Key must be a string")
    .notEmpty()
    .withMessage("Key must not be empty"),
]

export { credentialValidations }
