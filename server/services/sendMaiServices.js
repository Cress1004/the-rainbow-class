const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const { OAuth2Client } = require("google-auth-library");
const { transformScheduleTimeData } = require("../function/commonFunction");

const myOAuth2Client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

const sendMailInterview = async (
  { email, userName, link, scheduleTime },
  fileName,
  subject
) => {
  try {
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.SEND_EMAIL_ADDRESS,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refresh_token: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });

    let html = await readFile(`./server/mail/${fileName}.html`, "utf8");
    let template = handlebars.compile(html);
    const data = {
      username: userName,
      email: email,
      link: link,
      scheduletime: transformScheduleTimeData(scheduleTime),
    };
    let htmlToSend = template(data);

    const mailOptions = {
      from: process.env.SEND_EMAIL_ADDRESS,
      to: email,
      subject: subject,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
        return false;
      } else {
        return true;
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const sendMailAccount = async (
  { email, userName, token },
  fileName,
  subject
) => {
  try {
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.SEND_EMAIL_ADDRESS,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refresh_token: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    let html = await readFile(
      `${
        process.env.NODE_ENV === "production"
          ? `./server/mail/production/${fileName}.html`
          : `./server/mail/${fileName}.html`
      }`,
      "utf8"
    );
    let template = handlebars.compile(html);
    const data = {
      username: userName,
      email: email,
      token: token,
    };
    let htmlToSend = template(data);

    const mailOptions = {
      from: process.env.SEND_EMAIL_ADDRESS,
      to: email,
      subject: subject,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
        return false;
      } else {
        return true;
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  sendMailInterview,
  sendMailAccount,
};
