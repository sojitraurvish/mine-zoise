"use strict"
import nodemailer from 'nodemailer'


const logo: any = process.env.LOGO

const option: any = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
}
const transPorter = nodemailer.createTransport(option)

export const forgot_password_mail = async (mail_data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mailOptions = {
                from: process.env.SMTP_EMAIL,
                to: mail_data?.email,
                subject: "Zois Forget Password OTP",
                html: `<html lang="en-US">

                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Zois Forget Password OTP</title>
                    <meta name="description" content="Zois Forget Password OTP.">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
                
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <a href="https://legacyfolderapp.com/" title="logo" target="_blank">
                                                            <img src="https://zois-api.s3.us-west-2.amazonaws.com/zois_logo.png"
                                                                height="130px" widht="400px" title="logo" alt="logo">
                                                        </a>
                                                        <h1
                                                            style="color:#1e1e2d; font-weight:500; margin:0; padding-top: 20px;font-size:32px;font-family:'Rubik',sans-serif;">
                                                            Zois Forget Password OTP</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:6px 0 26px; border-bottom:1px solid #cecece; width:380px;"></span>
                                                        <p
                                                            style="color:#455056; font-size:15px;line-height:24px; margin:0; text-align:left;">
                                                            Hi ${mail_data.username || ""}
                                                            <br><br>
                                                            Your Verification code to recover your Zois Account Password is
                                                            ${mail_data.otp}. Please do not share it anyone.
                                                            <br><br>
                                                            Thanks & Regards <br>
                                                            Team Zois
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                        </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                </body>
                
                </html>`,
            }
            transPorter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instructions`)
                }
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

// export const login_verification_mail = async (mail_data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const mailOptions = {
//                 from: `Zois <${mail.mail}>`,
//                 to: mail_data?.email,
//                 subject: "Zois Sign up OTP",
//                 html: `<html lang="en-US">
//                 <head>
//                     <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
//                     <title>Zois Sign up OTP</title>
//                     <meta name="description" content="Zois Sign up OTP.">
//                     <style type="text/css">
//                         a:hover {
//                             text-decoration: underline !important;
//                         }
//                     </style>
//                 </head>
//                 <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
//                     <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
//                         style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
//                         <tr>
//                             <td>
//                                 <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
//                                     align="center" cellpadding="0" cellspacing="0">
//                                     <tr>
//                                         <td style="height:80px;">&nbsp;</td>
//                                     </tr>
//                                     <tr>
//                                         <td style="height:20px;">&nbsp;</td>
//                                     </tr>
//                                     <tr>
//                                         <td>
//                                             <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
//                                                 style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
//                                                 <tr>
//                                                     <td style="height:40px;">&nbsp;</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td style="padding:0 35px;">
//                                                         <h1
//                                                             style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
//                                                             Zois OTP verification</h1>
//                                                         <span
//                                                             style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
//                                                         <p
//                                                             style="color:#455056; font-size:15px;line-height:24px;text-align:left; margin:0;">
//                                                             Hi ${mail_data.firstName || ""} ${mail_data.lastName || ""},
//                                                             <br><br>
//                                                             Your Verification code For Zois App Sign up is ${mail_data.otp} .Please do
//                                                             not share it anyone.
//                                                             <br><br>
//                                                             Thanks & Regards<br>
//                                                             Team Zois
//                                                         </p>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td style="height:40px;">&nbsp;</td>
//                                                 </tr>
//                                             </table>
//                                         </td>
//                                     <tr>
//                                         <td style="height:20px;">&nbsp;</td>
//                                     </tr>
//                                     <tr>
//                                         <td style="height:80px;">&nbsp;</td>
//                           </tr>
//                         </tr>
//                     </table>
//                     </td>
//                     </tr>
//                     </table>
//                 </body>
                
//                 </html>`,
//             }
//             transPorter.sendMail(mailOptions, function (err, data) {
//                 if (err) {
//                     console.log(err)
//                     reject(err)
//                 } else {
//                     resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instructions`)
//                 }
//             })
//         } catch (error) {
//             console.log(error)
//             reject(error)
//         }
//     })
// }

// export const email_verification_mail = async (mail_data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const mailOptions = {
//                 from: `Zois <${mail.mail}>`,
//                 to: mail_data?.email,
//                 subject: "Zois Sign up OTP",
//                 html: `<html lang="en-US">
//                 <head>
//                     <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
//                     <title>Zois Sign up OTP</title>
//                     <meta name="description" content="Zois Sign up OTP.">
//                     <style type="text/css">
//                         a:hover {
//                             text-decoration: underline !important;
//                         }
//                     </style>
//                 </head>
                
//                 <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
//                     <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
//                         style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
//                         <tr>
//                             <td>
//                                 <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
//                                     align="center" cellpadding="0" cellspacing="0">
//                                     <tr>
//                                         <td style="height:80px;">&nbsp;</td>
//                                     </tr>
//                                     <tr>
//                                         <td style="text-align:center;">
                
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td>
//                                             <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
//                                                 style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
//                                                 <tr>
//                                                     <td style="height:40px;">&nbsp;</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td style="padding:0 35px;">
//                                                         <a href="https://legacyfolderapp.com/" title="logo" target="_blank">
//                                                             <img src="https://zois-api.s3.us-west-2.amazonaws.com/zois_logo.png"
//                                                                 height="130px" widht="400px" title="logo" alt="logo">
//                                                         </a>
//                                                         <h1
//                                                             style="color:#1e1e2d; font-weight:500; margin:0; padding-top: 20px;font-size:32px;font-family:'Rubik',sans-serif;">
//                                                             Zois OTP verification</h1>
//                                                         <span
//                                                             style="display:inline-block; vertical-align:middle; margin:6px 0 26px; border-bottom:1px solid #cecece; width:300px;"></span>
//                                                         <p
//                                                             style="color:#455056; font-size:15px;line-height:24px;text-align:left; margin:0;">
//                                                             Hi ${mail_data.username || ""},
//                                                             <br><br>
//                                                             Your Verification code For Zois App Sign up is ${mail_data.otp}. Please do
//                                                             not share it anyone.
//                                                             <br><br>
//                                                             Thanks & Regards<br>
//                                                             Team Zois
//                                                         </p>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td style="height:40px;">&nbsp;</td>
//                                                 </tr>
//                                             </table>
//                                         </td>
//                                     <tr>
//                                         <td style="height:20px;">&nbsp;</td>
//                                     </tr>
//                                     <tr>
//                                         <td style="height:80px;">&nbsp;</td>
//                                     </tr>
//                         </tr>
//                     </table>
//                     </td>
//                     </tr>
//                     </table>
//                 </body>
                
//                 </html>`,
//             }
//             transPorter.sendMail(mailOptions, function (err, data) {
//                 if (err) {
//                     console.log(err)
//                     reject(err)
//                 } else {
//                     resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instructions`)
//                 }
//             })
//         } catch (error) {
//             console.log(error)
//             reject(error)
//         }
//     })
// }

