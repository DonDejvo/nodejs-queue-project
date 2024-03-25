import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import Bull, { Job } from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 7890;
const app = express();
const emailQueue = new Bull("email", {
    redis: process.env.REDIS_URL
});

app.use(bodyParser.json());

type EmailType = {
    from: string;
    to: string;
    subject: string;
    text: string;
}

const sendEmail = async (email: EmailType) => {
    emailQueue.add({ ...email });
}

const processEmailQueue = async (job: Job) => {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const { from, to, subject, text } = job.data;

    console.log(`Sending mail to ${to}`);
    
    const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: `<strong>${text}</strong>`
    });

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return nodemailer.getTestMessageUrl(info);
}

emailQueue.process(processEmailQueue);

app.post("/send-email", async (req, res) => {
    const { from, to, subject, text } = req.body;

    await sendEmail({ from, to, subject, text });

    console.log(`Added to queue`);
    
    res.json({
        message: "Email Sent"
    });

});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})

