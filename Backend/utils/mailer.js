import dotenv from "dotenv";
dotenv.config(); // ✅ Must load before using env vars

import nodemailer from "nodemailer";

// ✅ Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for Gmail 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ HTML offer letter with fallback values
const generateOfferLetterHTML = (data) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color:#2c3e50; text-align:center;">Internship Offer Letter</h2>

    <p>
      <b>Name:</b> ${data.name ?? "Not Provided"} (${data.registerNo ?? "-"})
      <br/>
      <b>Email:</b> ${data.email ?? "Not Provided"}
      <br/>
      <b>Department:</b> ${data.department ?? "Department Not Provided"}
      <br/>
      <b>College:</b> ${data.college ?? "College Not Provided"}
    </p>

    <p>Dear <b>${data.name ?? "Student"} (${data.registerNo ?? "-"})</b>,</p>

    <p>
      In reference to your application, we would like to congratulate you on being selected for an internship with 
      <b>${data.company ?? "Our Company"}</b>. 
      You will work as an intern with our development company Domainhostly and W3AppDevelopers, located at Coimbatore and Erode. 
      Your training is scheduled to start effectively this week. 
      ${data.companyWebsite ? `Visit <a href="${data.companyWebsite}" target="_blank">${data.companyWebsite}</a> for more info.` : ""}
      We are excited that you will be joining our team!
    </p>

    <p>
      <b>W3AppDevelopers</b> is a Web and Mobile App Development Company specializing in Android and Web applications. <br/>
      <b>Domainhostly</b>: Looking for website domain and hosting? Get an all-inclusive plan and go live instantly! 
      Create your ideal website in minutes. Try Domainhostly’s best-ranked web hosting plans. 
      Fast Web Hosting, Easy-to-use cPanel & 1-Click CMS Install. Choose from Linux Shared, Cloud, VPS & Dedicated hosting.
    </p>

    <p>
      As such, your internship will include training/orientation and focus primarily on learning and developing new skills, 
      gaining knowledge and understanding the concepts you learned in class through hands-on application. 
      This internship will be very useful for your career.
    </p>

    <p>
      The project details and technical platform will be shared with you on or before commencement of training.
    </p>

    <p>
      Please confirm your internship with your HOD and Class Advisor and submit your permission letter. 
      Come and visit our company on <b>${data.fromDate ?? "the mentioned date"}</b>.
    </p>

    <h3>📍 Training Location:</h3>
    <p>
      <b>${data.company ?? "Domainhostly.com"}</b><br/>
      Web: <a href="${data.companyWebsite ?? 'https://www.domainhostly.com'}" target="_blank">
        ${data.companyWebsite ?? 'www.domainhostly.com'}
      </a><br/>
      Call: +91 96985 48633<br/>
      Contact Person: <b>Boopathi Kumar K</b>
    </p>

    <p>
      Again, congratulations and we look forward to working with you.
    </p>

    <p>
      Yours sincerely,<br/>
      <b>${data.company ?? "Company"} Team</b><br/>
      K. Boopathi Kumar<br/>
      CEO and Founder
    </p>

    <hr style="margin:20px 0;"/>
    <p style="font-size:12px; color:#777;">
      This is a system-generated email. Please do not reply directly.
    </p>
  </div>
`;

// ✅ Function to send offer letter
export default async function sendOfferLetterEmail(data) {
  try {
    // ✅ Validate required fields
    if (!data.name || !data.email || !data.company) {
      throw new Error("Missing required fields: name, email, or company");
    }

    const htmlContent = generateOfferLetterHTML(data);

    const info = await transporter.sendMail({
      from: `"${data.company} HR Team" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Internship Offer Letter - ${data.company}`,
      html: htmlContent,
    });

    console.log(`✅ Offer letter sent to ${data.email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send offer letter:", error.message);
    return false;
  }
}
