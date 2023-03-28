import { ErrorResponse } from "../index.js"

export function createError(
  status: number,
  name: string,
  message: string
): ErrorResponse {
  return {
    status,
    name,
    message,
  }
}
