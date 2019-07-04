const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const path = require('path');
const emailConfig = require('./../config/email');

  const generarHtml =  (archivo, opciones= {}) => {
    const rutaArchivo = path.join(__dirname, '/../views/emails');
    const html = pug.renderFile(`${rutaArchivo}/${archivo}.pug`, opciones);
    return juice(html);
}

  exports.enviar = async (opciones) => {  
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    var mailOptions = {
        from: "TaskManager <no-reply@task-manager.com>",
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
     };
    
    
    var mailer=nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 465,
        secure: false,
        auth: {
            user: "540dc7c139be40",
            pass: "d990ce4f11f1c0"
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    
    await mailer.sendMail(mailOptions, (error, respuesta)=>{
        if(error){
            console.log('mail not sent \n',error);
        }
        else{
            console.log("Message sent: " ,respuesta.response);
        }   
     });
  }
