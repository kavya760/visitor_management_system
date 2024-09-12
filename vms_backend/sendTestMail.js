const sendEmail = require('./sendMail');

const recipientEmail = 'katoshaktiv@gmail.com';
const emailSubject = 'Hi';
const emailBody = '<p>Hello! This is a test email.</p>';

sendEmail(recipientEmail, emailSubject, emailBody)
    .then(() => console.log('Email sending process completed.'))
    .catch(err => console.error('Error in sending email:', err));
