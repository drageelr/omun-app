'use strict'
/*
------------------ DEPENDENCIES --------------------
*/

// Modules:
var nodemailer = require('nodemailer');
var emailTemplate = require('../resources/email-template');

// Varaibles:
let emailer = nodemailer.createTransport({
    host: "mail.lumun.live",
    port: 587,
    auth: {
        user: "omun@lumun.live",
        pass: "@.omun99.@"
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
            from: 'Online MUN Application <omun@lumun.live>',
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