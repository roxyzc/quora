import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface UserParams {
  email: string;
  username: string;
}

const configService = new ConfigService();
const transporter = async () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configService.getOrThrow('se_user'),
      pass: configService.getOrThrow('se_password'),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendOTPWithEmail = async (
  { email, username }: UserParams,
  otp: string,
): Promise<boolean> => {
  const mailOptions = {
    from: `"OTP"`,
    to: email,
    subject: `Hello ${username} OTP<five minute expiration>`,
    html: `<h1 style="text-align: center; margin: auto;">${otp}</h1>`,
  };

  try {
    await (await transporter()).sendMail(mailOptions);
    return Promise.resolve(true);
  } catch (error) {
    console.error(error.message);
    return Promise.resolve(false);
  }
};
