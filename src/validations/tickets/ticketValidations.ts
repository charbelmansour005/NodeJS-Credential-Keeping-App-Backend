import { check } from "express-validator"

const ticketValidations = [
  check("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title must not be empty")
    .isLength({ min: 2, max: 25 })
    .withMessage("Title must be between 2 and 25 characters"),
  check("body")
    .isString()
    .withMessage("Body must be a string")
    .notEmpty()
    .withMessage("Body must not be empty")
    .isLength({ min: 2, max: 400 })
    .withMessage("Body must be between 2 and 400 characters"),
]

const ticketUpdateValidations = [
  check("status")
    .isString()
    .withMessage("Status must be a string")
    .notEmpty()
    .withMessage("Status must not be empty")
    .isLength({ min: 7, max: 10 }),
]

export { ticketValidations, ticketUpdateValidations }
