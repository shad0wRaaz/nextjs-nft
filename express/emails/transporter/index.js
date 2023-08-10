
import { SMTPClient } from 'emailjs';

export const emailClient = new SMTPClient({
    user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
    password: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
    port: process.env.NEXT_PUBLIC_SMTP_PORT,
    ssl: process.env.NEXT_PUBLIC_SMTP_SSL,
    tls: true,
    timeout: process.env.NEXT_PUBLIC_SMTP_TIMEOUT,
  });

export const sendEmail = async(
    to, subject, emailBody
) => {

    try {
        to.map(async receiver => {
            const message = await emailClient.sendAsync({
              text: emailBody,
              attachment: [{ data: emailBody, alternative: true }],
              from: process.env.NEXT_PUBLIC_SMTP_EMAIL,
              to: receiver,
              subject,
            });            
        })

        return true;
      } catch (err) {
        console.log(err)
        return false;
      }
}