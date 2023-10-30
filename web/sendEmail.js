
import nodemailer from 'nodemailer';


var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5d6bccdf48d164",
      pass: "e910235e094c1f"
    }
  });
  

  





  export function sendEmail({text, subject, to, from, callback}){

    let mailOptions = {
        from: 'neuralnectar@neuralnectar.com', // sender address
        to: 'hasanseirafi69@gmail.com', // list of receivers
        subject, // Subject line
        text: 'Hello, this is a test email.' // plain text body
      };


  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    callback(error, info);
    console.log('Message sent: %s', info.messageId);
  });
}