import { SMTPClient } from 'emailjs'

export default async function handler(req, res) {
  const { email, emailBody, subjectText } = req.body

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
      from: process.env.NEXT_PUBLIC_EMAIL,
      to: email,
      subject: subjectText,
    })
  } catch (err) {
    res.status(400).send(JSON.stringify({ message: err.message }))
    return
  }
  res.status(200).send(JSON.stringify({ message: 'send mail' }))
}

