import jsonwebtoken, { JwtPayload } from "jsonwebtoken"
import { createError } from "../../utils/errorUtils.js"

const { verify } = jsonwebtoken

export async function getRoleService(authHeader: string) {
  if (!authHeader) {
    throw createError(401, "Unauthenticated", "Unauthenticated")
  }
  const access_token = authHeader.split(" ")[1]
  let decodedToken: string | JwtPayload
  decodedToken = verify(access_token, process.env.SECRET as string) as {
    role: string
  }
  if (!decodedToken) {
    throw createError(500, "Error", "There was a problem finding your role")
  }
  const role = decodedToken.role

  return {
    role: role,
  }
}
