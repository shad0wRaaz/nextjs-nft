import { SMTPClient } from 'emailjs'

export default async function handler(req, res) {
  const { email, emailBody, subjectText } = req.body

  //   const client = new SMTPClient({
  //     user: 'noreply@metanuva.com',
  //     password: 'London@2022',
  //     host: 'smtp.gmail.com',
  //     port: 465,
  //     ssl: true,
  //     tls: true,
  //     timeout: 50000,
  //   })
  const client = new SMTPClient({
    user: process.env.NEXT_PUBLIC_EMAIL,
    password: process.env.NEXT_PUBLIC_PASSWORD,
    host: process.env.NEXT_PUBLIC_SMTP,
    port: 587,
    ssl: false,
    tls: true,
    timeout: 50000,
  })

  try {
    const message = await client.sendAsync({
      text: emailBody,
      attachment: [{ data: emailBody, alternative: true }],
      from: 'no-reply@metanuva.com',
      to: email,
      subject: subjectText,
    })
  } catch (err) {
    res.status(400).end(JSON.stringify({ message: err.message }))
    return
  }
  res.status(200).end(JSON.stringify({ message: 'send mail' }))
}
// smtp.gmail.com
// Requires SSL: Yes
// Requires TLS: Yes (if available)
// Requires Authentication: Yes
// Port for SSL: 465
// Port for TLS/STARTTLS: 587
// no-reply@metanuva.com
// London@2022
