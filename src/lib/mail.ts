import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(email: string, otp: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials missing. Skipping email send. OTP is:", otp);
    return;
  }
  
  const mailOptions = {
    from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Hostel Login OTP',
    text: `Your One-Time Password (OTP) for login is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Login Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendComplaintNotification(email: string, title: string, details: string, studentName: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials missing. Skipping complaint notification.");
    return;
  }

  const mailOptions = {
    from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `New Complaint: ${title}`,
    text: `A new complaint has been filed by ${studentName}.\n\nTitle: ${title}\nDetails: ${details}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>New Complaint Logged</h2>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Details:</strong> ${details}</p>
        <br/>
        <p>Please review this on the Warden Dashboard.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendComplaintStatusUpdate(email: string, title: string, status: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials missing. Skipping complaint status update email.");
    return;
  }

  const mailOptions = {
    from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Complaint Status Updated: ${status}`,
    text: `Your complaint "${title}" has been updated to: ${status}.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Complaint Update</h2>
        <p>Your complaint <strong>"${title}"</strong> has been updated to:</p>
        <h3 style="color: #F59E0B;">${status}</h3>
        <br/>
        <p>Check the student dashboard for more details.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
