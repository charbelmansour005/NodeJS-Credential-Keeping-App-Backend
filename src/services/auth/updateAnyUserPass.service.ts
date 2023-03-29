import { User } from "../../models/user.model.js"
import { UserModel } from "../../types/types.js"
import { createError } from "../../utils/errorUtils.js"
import bcryptjs from "bcryptjs"
import { transporter } from "../../helper/transporter.js"

const { hash } = bcryptjs

export async function updateAnyUserPass(resetPasswordBody: UserModel) {
  const { email, newPassword } = resetPasswordBody

  if (!email || !newPassword) {
    throw createError(
      404,
      "Missing elements",
      "Please provide the client's email and a new password"
    )
  }

  const userToUpdate = await User.findOne({ email: email })

  if (!userToUpdate) {
    throw createError(
      404,
      "Not Found",
      "Could not find the user you are trying to update"
    )
  }

  const hashedPassword = await hash(newPassword, 12)

  userToUpdate.password = hashedPassword

  transporter.sendMail({
    to: email,
    from: "employees@node-complete.com",
    subject: "Password Change Request",
    html: `
        <h1>Password Updated</h1>\n
        <h3>Your new password was updated by as per your request.</h3>\n
        <p>New Password: <strong>${newPassword}</strong><p>
        <p>Thank you for choosing us and we hope we were able to help you out.</p>
        `,
  })

  await userToUpdate.save()

  return {
    message: "Password update success, the client was notified by email.",
  }
}
