import nodemailer from "nodemailer";

// ✅ Company Info + Email credentials (Hardcoded)
const companies = {
  "Training Trains": {
    website: "https://trainingtrains.com",
    email: "",
    pass: "",
    smtpHost: "",
  },
  Domainhostly: {
    website: "https://domainhostly.com",
    email: "",
    pass: "",
    smtpHost: "",
  },
  W3AppDevelopers: {
    website: "https://w3appdevelopers.com",
    email: "",
    pass: "",
    smtpHost: "",
  },
};

const FIXED_COLLAB_ORDER = ["Training Trains", "Domainhostly", "W3AppDevelopers"];

function getTransporter(company) {
  const selected = companies[company] || companies["Training Trains"];
  return nodemailer.createTransport({
    host: selected.smtpHost,
    port: 465,
    secure: true,
    auth: {
      user: selected.email,
      pass: selected.pass,
    },
  });
}

function getCollaborationCompanies(mainCompany) {
  return FIXED_COLLAB_ORDER.filter((c) => c !== mainCompany).join(" & ");
}

function generateOfferLetterHTML(data) {
  const mainCompany = data.company && companies[data.company] ? data.company : "Training Trains";
  const mainWebsite = companies[mainCompany].website;
  const collaborationCompanies = getCollaborationCompanies(mainCompany);

  return `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 15px;">
    <p><b>Name:</b> ${data.name} (${data.registerNo})<br/>
    <b>Gmail:</b> ${data.email}<br/>
    <b>Department:</b> ${data.department}<br/>
    <b>College:</b> ${data.college}</p>

    <p>Dear <b>${data.name} (${data.registerNo})</b>,</p>

    <p style="text-align: justify;">
      In reference to your application we would like to congratulate you on being selected for internship with <b>${mainCompany}</b>. 
      You have to work as an intern with our development company <b>${collaborationCompanies}</b> which is located at Coimbatore and Erode. 
      Your training is scheduled to start effectively this week. 
      <a href="${mainWebsite}" target="_blank">${mainWebsite}</a> are excited that you will be joining our team!
    </p>

    <h3>Collaboration Companies:</h3>
    <p><b>Training Trains:</b> ... Web: trainingtrains.com</p>
    <p><b>Domainhostly:</b> ... Web: domainhostly.com</p>
    <p><b>W3AppDevelopers:</b> ... Web: w3appdevelopers.com</p>

    <p style="text-align: justify;">
      Your internship will include training/orientation and focus primarily on learning, gaining skills and understanding the concepts you learned in class through hands-on application.
    </p>

    <p>
      Please confirm your internship with your HOD and Class Advisor and submit your permission letter.<br/>
      Come and visit our company on <b>${data.fromDate}</b><br/>
      Internship duration: <b>${data.fromDate}</b> to <b>${data.toDate}</b>
    </p>

    <p>
      Report to:<br/>
      <a href="${mainWebsite}" target="_blank">${mainWebsite}</a><br/>
      <b>Contact Person:</b> Boopathi Kumar K<br/>
      Call: +91 96985 48633<br/>
      Address:<br/>
      332 Mullamparappu, N.G.Palayam Post, Erode, Tamil Nadu 638115<br/>
      Location: <a href="https://maps.app.goo.gl/1HEqmSsf3mdXzR7g6" target="_blank">Google Maps</a>
    </p>

    <p>Again, congratulations and we look forward to working with you.</p>

    <p>
      Yours sincerely,<br/><br/>
      <b>${mainCompany} Team</b><br/>
      K. Boopathi Kumar<br/>
      CEO & Founder
    </p>

    <hr style="margin:20px 0;"/>
    <p style="font-size:12px; color:#777;">This is a system-generated email. Please do not reply directly.</p>
  </div>`;
}

export default async function sendOfferLetterEmail(data) {
  try {
    if (!data.name || !data.email) throw new Error("Missing required fields: name or email");

    const mainCompany = data.company && companies[data.company] ? data.company : "Training Trains";
    const transporter = getTransporter(mainCompany);
    const htmlContent = generateOfferLetterHTML(data);

    const info = await transporter.sendMail({
      from: `"${mainCompany} HR Team" <${companies[mainCompany].email}>`,
      to: data.email,
      subject: `Internship Offer Letter - ${mainCompany}`,
      html: htmlContent,
    });

    console.log(`✅ Email sent from ${mainCompany} to ${data.email} [${info.messageId}]`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send offer letter:", error.message);
    return false;
  }
}
