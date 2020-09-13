'use strict'
/*
------------------ DEPENDENCIES --------------------
*/

// Modules:
var nodemailer = require('nodemailer');

// Varaibles:
let emailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omun.app@gmail.com',
        pass: '@.omun12345.@'
    }
});


function sendEmail (mailOptions) {
    emailer.sendMail(mailOptions, function(err , info) {
        if (err) {
        console.log(err);
        } else {
        console.log("Email sent to \"" + emailTarget + "\" " + info.response);
        }
    });
}


exports.sendWelcomeEmail = (emailTarget, name, password) => {
    let mailOptions = {
        from: 'OMUN App <omun.app@gmail.com>',
        to: emailTarget,
        subject: 'Welcome to OMUN App',
        html: `<h>Welcome to OMUN App</h><p>Dear ${name},<br>Your system generated password is <strong>${password}</strong><br>Kindly change your password by loging in to the app<br>for any bugs/feedback please contact the LUMUN IT Director Hammad Nasir at hammadn99@gmail.com</p>`
    };

    sendEmail(mailOptions);
}