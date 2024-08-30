import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'sajjad.ali5112@gmail.com',
    from: 'test@example.com', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

export default async function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions).then(
            (response) => {
                resolve({ msg: 'Email sent successfully!', response });
            },
            (error) => {
                if (error.response) {
                    reject(error.response.body);
                }
            }
        );
    });
};
