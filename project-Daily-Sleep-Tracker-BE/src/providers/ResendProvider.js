/**lap_trinh_tich_hop_nang_cao_MERN_stack*/
const { Resend } = require('resend');
import { env } from '~/config/environment';

const resend = new Resend(env.RESEND_API_KEY)


const sendMail = async (recipientMail, customSubject, htmlContent) => {
  try {
    const result = await resend.emails.send({
      from: 'noreply@reniwdev.uk',
      to: recipientMail,
      subject: customSubject,
      html: htmlContent
    })
    console.log('Resend result:', result)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}


export const ResendProvider = {
  sendMail
}


