'use strict'
/*
------------------ DEPENDENCIES --------------------
*/

// Modules:
var nodemailer = require('nodemailer');
var emailTemplate = require('../resources/email-template');

// Varaibles:
let emailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omun.app17@gmail.com',
        pass: 'omun12345'
    }
});


// function sendEmail (mailOptions) {
//     emailer.sendMail(mailOptions, function(err , info) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Email sent to \"" + emailTarget + "\" " + info.response);
//         }
//     });
// }


exports.sendWelcomeEmail = async (emailTarget, name, password, accountType = "") => {
    try {
        let mailOptions = {
            from: 'OMUN App <omun.app17@gmail.com>',
            to: emailTarget,
            subject: 'Welcome to OMUN App',
            html: emailTemplate.generateAccountCreationEmail(name, accountType, emailTarget, password)
        };
    
        let info = await emailer.sendMail(mailOptions);
        console.log("Email sent to \"" + emailTarget + "\" " + info.response);
    } catch(err) {
        console.log("EMAIL ERROR:", err);
    }
}