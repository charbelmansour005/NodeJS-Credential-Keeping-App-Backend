import { User } from "../../../models/user.model.js"
import { createError } from "../../../utils/errorUtils.js"

export const banAnyUserService = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw createError(
      404,
      "User not found",
      "Make sure you entered the correct ID"
    )
  }

  user.isBanned = !user.isBanned
  await user.save()

  let message = ""

  if (user.isBanned) {
    message = "User has been banned"
  } else {
    message = "User ban removed"
  }

  return {
    result: {
      message: message,
      details: user,
    },
  }
}
