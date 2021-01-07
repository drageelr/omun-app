var emailer = require('./services/nodemailer');
const {default: PQueue} = require('p-queue');

let emailQueue = new PQueue({concurrency: 1});

const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('delegates.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    for (let i = 0; i < results.length; i++) {
        emailQueue.add(async () => { await emailer.sendWelcomeEmail(results[i].email, results[i].name, results[i].password, "Delegate") })
        // console.log(results[i].email, results[i].name, results[i].password, "Delegate");
    }
    
  });
