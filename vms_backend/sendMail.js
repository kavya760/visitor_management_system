const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
    console.log('sendEmail function called');
    console.log('Recipient:', to);
    console.log('Subject:', subject);
    
    try {
        console.log('Creating transporter...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kavyargowda609@gmail.com',
                pass: 'suzs twzx zmed sbcz'   
            },
            secure: true,
            port: 465,
            debug: true
        });

        console.log('Sending email...');
        const info = await transporter.sendMail({
            from: 'kavyargowda609@gmail.com',
            to : 'kavyargowda609@gmail.com',            
            subject: subject,
            html: htmlContent
        });

        console.log('Email sent successfully');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
