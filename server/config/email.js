import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendWelcomeEmail = async (email, name, role, additionalInfo = '') => {
    const mailOptions = {
        from: 'support@gmail.com',
        to: email,
        subject: `Welcome to Our School! - ${role}`,
        text: `Dear ${name},\n\nYou have been successfully added as a ${role.toLowerCase()}${additionalInfo}.\n\nWelcome aboard!\n\nBest Regards,\nSchool Team`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};