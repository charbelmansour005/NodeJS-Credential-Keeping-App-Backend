import { createTransport } from "nodemailer"

export var transporter = createTransport({
  service: "gmail",
  auth: {
    user: "charbelmansour005@gmail.com",
    pass: "encxvodkkuczlxdv",
  },
})
