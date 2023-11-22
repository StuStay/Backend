import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import mailgun from 'mailgun-js';
import crypto from 'crypto';
import emailValidator from 'email-validator';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const apikeyM = 'df9be2ebe5f925e0277d75db9406a12d';
const DOMAIN = 'sandbox4cd1220c92f147a59dd4f67dc891c702.mailgun.org';
const mg = mailgun({ apiKey: apikeyM, domain: DOMAIN });


const registerSchema = Joi.object({
    name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().valid('admin', 'proprietaire', 'etudiant').required(),
});


const register = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    bcrypt.hash(req.body.password, 10, function (err, hashedpass) {
        if (err) {
            res.status(500).json({
                error: err,
            });
        }

        let user = new User({
            name: req.body.name,
            last_name: req.body.last_name,
            password: hashedpass,
            email: req.body.email,
            avatar: req.body.avatar,
            age: req.body.age,
            gender: req.body.gender,
            phone: req.body.phone,
            role: req.body.role, // "admin", "proprietaire", "etudiant"
        });

        if (req.file) {
            user.avatar = req.file.path;
        }

        user.save()
            .then((user) => {
                res.status(200).json({
                    message: 'User Added Successfully',
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: 'An error Occurred!',
                });
            });
    });
};

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const login = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    var email = req.body.email;
    var password = req.body.password;

    let user = await User.findOne({ email: email });

    if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                res.status(500).json({
                    error: err,
                });
            }

            if (result) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                user.token = accessToken;
                user.save();

                res.cookie('JWT', accessToken, {
                    httpOnly: true,
                });

                res.status(200).json({ user, accessToken, refreshToken });
            } else {
                res.status(400).json({
                    message: 'Password does not match!',
                });
            }
        });
    } else {
        res.status(404).json({
            message: 'No user found',
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('JWT');
    res.clearCookie('Email');
    res.clearCookie('token');

    res.json({
        message: 'Successfully logout!',
    });
};

const forgot_password = (req, res) => {
    const { email } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ error: 'User with this email does not exist.' });
            }

            const token = jwt.sign({ _id: user._id }, 'AzerTy,5()', { expiresIn: '20m' });
            res.cookie('resettoken', token);

            const data = {
                from: 'noreply@hello.com',
                to: email,
                subject: 'Password Reset Link',
                html: `  
                    <h2>Please click on the given link to reset your password</h2>
                    <p>http://localhost:3000/resetpassword/${token}</p> 
                `,
            };

            return user
                .updateOne({ resetLink: token })
                .then((success) => {
                    mg.messages().send(data, (error, body) => {
                        if (error) {
                            return res.status(500).json({ error: error.message });
                        }
                        return res.status(200).json({ message: 'Email has been sent' });
                    });
                })
                .catch((err) => {
                    return res.status(500).json({ error: 'Reset password link error' });
                });
        })
        .catch((err) => {
            return res.status(500).json({ error: 'An error occurred while finding the user.' });
        });
};

const reset_password = (req, res) => {
    const { newPass } = req.body;
    const resetLink = req.cookies.resettoken;

    if (!resetLink) {
        return res.status(401).json({ error: 'Authentication error!!!!' });
    }

    jwt.verify(resetLink, 'AzerTy,5()', (error, decodedData) => {
        if (error) {
            return res.status(401).json({
                error: 'Incorrect token or it is expired.',
                message: error.message,
            });
        }

        User.findOne({ _id: decodedData._id })
            .then((user) => {
                if (!user) {
                    return res.status(400).json({ error: 'User with this token does not exist.' });
                }

                bcrypt.hash(newPass, 10)
                    .then((hashedpass) => {
                        user.password = hashedpass;
                        user.resetLink = '';

                        user.save()
                            .then((result) => {
                                res.clearCookie('resettoken');

                                return res.status(200).json({ message: 'Your password has been changed' });
                            })
                            .catch((err) => {
                                return res.status(500).json({ error: 'Reset password error' });
                            });
                    })
                    .catch((err) => {
                        return res.status(500).json({ error: 'Error hashing the password' });
                    });
            })
            .catch((err) => {
                return res.status(500).json({ error: 'An error occurred while finding the user.' });
            });
    });
};

const generateRandomString = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomString(32); 
const refreshSecretKey = generateRandomString(32); 

console.log('Secret Key:', secretKey);
console.log('Refresh Secret Key:', refreshSecretKey);

const generateAccessToken = (user) => {
    return jwt.sign({ name: user.name }, secretKey , { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ name: user.name }, refreshSecretKey , { expiresIn: '7d' });
};





const motDePasseOublie = async (req, res) => {
    const codeDeReinit = req.body.codeDeReinit
    console.log ("code test")
    const user = await User.findOne({ "email": req.body.email })

    if (user) {

        envoyerEmailReinitialisation(req.body.email, codeDeReinit)

        res.status(200).send({ "message": "L'email de reinitialisation a Ã©tÃ© envoyÃ© a " + user.email })
    } else {
        res.status(404).send({ "message": "Utilisateur innexistant" })
    }
}

const changerMotDePasse = async (req, res) => {
    const { email, nouveauMotDePasse } = req.body

    nouveauMdpEncrypted = await bcrypt.hash(nouveauMotDePasse, 10)

    let user = await User.findOneAndUpdate(
        { email: email },
        {
            $set: {
                password: nouveauMdpEncrypted
            }
        }
    )

    res.send({ user })
}

async function envoyerEmailReinitialisation(email, codeDeReinit) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'espritstustay@gmail.com',
            pass: 'ectc bbia gubn anee'
        }
    })

    transporter.verify(function (error, success) {
        if (error) {
            console.log(error)
            console.log("Server not ready")
        } else {
            console.log("Server is ready to take our messages")
        }
    })

    const mailOptions = {
        from: 'espritstustay@gmail.com',
        to: email,
        subject: 'Reinitialisation de votre mot de passe ',
        html: "<h3>Vous avez envoyÃ© une requete de reinitialisation de mot de passe </h3><p>Entrez ce code dans l'application pour proceder : <b style='color : blue'>" + codeDeReinit + "</b></p>"
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent : ' + info.response)
        }
    })
}



///////////////////////////

 async function SendCodeForgot(req, res, next) {
    const userMail = await User.findOne({ email: req.body.email });
    console.log(userMail);
  
    if (!userMail) {
      res.status(202).json({
        message: "email not found",
      });
    } else {
      var RandomXCode = Math.floor(1000 + Math.random() * 9000);
      console.log(RandomXCode);
      //
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'espritstustay@gmail.com',
            pass: 'ectc bbia gubn anee'
        },
      });
  
      var mailOptions = {
        from: "Mahmoud",
        to: req.body.email,
        text: "Forget Password?",
        subject: "Password Reset",
        html: `<!DOCTYPE html>
        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
          <head>
            <title></title>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <!--[if mso]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                <o:AllowPNG/>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if !mso]>
            <!-->
            <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Alegreya" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css" />
            <!--
            <![endif]-->
            <style>
              * {
                box-sizing: border-box;
              }
        
              body {
                margin: 0;
                padding: 0;
              }
        
              a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
              }
        
              #MessageViewBody a {
                color: inherit;
                text-decoration: none;
              }
        
              p {
                line-height: inherit
              }
        
              .desktop_hide,
              .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
              }
        
              @media (max-width:520px) {
                .desktop_hide table.icons-inner {
                  display: inline-block !important;
                }
        
                .icons-inner {
                  text-align: center;
                }
        
                .icons-inner td {
                  margin: 0 auto;
                }
        
                .image_block img.big,
                .row-content {
                  width: 100% !important;
                }
        
                .mobile_hide {
                  display: none;
                }
        
                .stack .column {
                  width: 100%;
                  display: block;
                }
        
                .mobile_hide {
                  min-height: 0;
                  max-height: 0;
                  max-width: 0;
                  overflow: hidden;
                  font-size: 0px;
                }
        
                .desktop_hide,
                .desktop_hide table {
                  display: table !important;
                  max-height: none !important;
                }
              }
            </style>
          </head>
          <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
              <tbody>
                <tr>
                  <td>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;">
                                          <br>
                                          <br>
                                          <br>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;">
                                          <div align="center" class="alignment" style="line-height:10px">
                                            <img alt="reset-password" class="big" src="https://i.ibb.co/9g5fBQW/gif-resetpass.gif" style="display: block; height: auto; border: 0; width: 350px; max-width: 100%;" title="reset-password" width="350" />
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="text-align:center;width:100%;">
                                          <h1 style="margin: 0; color: #393d47; direction: ltr; font-family: Tahoma, Verdana, Segoe, sans-serif; font-size: 25px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                            <strong>Forgot your password?</strong>
                                          </h1>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="10" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                      <tr>
                                        <td class="pad">
                                          <div style="font-family: Tahoma, Verdana, sans-serif">
                                            <div class="" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;">
                                              <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">
                                                <span style="font-size:14px;">
                                                  <span style="">Not to worry, we got you! </span>
                                                  <span style="">Let’s get you a new password.</span>
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="15" cellspacing="0" class="button_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad">
                                          <div align="center" class="alignment">
                                            <!--[if mso]>
                                                  <v:roundrect
                                                    xmlns:v="urn:schemas-microsoft-com:vml"
                                                    xmlns:w="urn:schemas-microsoft-com:office:word" href="www.yourwebsite.com" style="height:58px;width:272px;v-text-anchor:middle;" arcsize="35%" strokeweight="0.75pt" strokecolor="#FFC727" fillcolor="#ffc727">
                                                    <w:anchorlock/>
                                                    <v:textbox inset="0px,0px,0px,0px">
                                                      <center style="color:#393d47; font-family:Tahoma, Verdana, sans-serif; font-size:18px">
                                                        <![endif]-->
                                            <a style="text-decoration:none;display:inline-block;color:#393d47;background-color:#ffc727;border-radius:20px;width:auto;border-top:1px solid #FFC727;font-weight:undefined;border-right:1px solid #FFC727;border-bottom:1px solid #FFC727;border-left:1px solid #FFC727;padding-top:10px;padding-bottom:10px;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank">
                                              <span style="padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;">
                                                <span style="word-break: break-word;">
                                                  <span data-mce-style="" style="line-height: 36px;">
                                                    <strong>${RandomXCode}</strong>
                                                  </span>
                                                </span>
                                              </span>
                                            </a>
                                            <!--[if mso]>
                                                      </center>
                                                    </v:textbox>
                                                  </v:roundrect>
                                                  <![endif]-->
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="text_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                      <tr>
                                        <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                          <div style="font-family: Tahoma, Verdana, sans-serif">
                                            <div class="" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;">
                                              <p style="margin: 0; mso-line-height-alt: 19.5px;">
                                                <span style="font-size:13px;">If you didn’t request to change your password, simply ignore this email.</span>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="15" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                      <tr>
                                        <td class="pad">
                                          <div style="font-family: Tahoma, Verdana, sans-serif">
                                            <div class="" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;">
                                              <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">
                                                <span style="font-size:10px;">If you continue to have problems</span>
                                                <br />
                                                <span style="font-size:10px;">please feel free to contact us at discoverytn@zohomail.com. </span>
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                              <tbody>
                                <tr>
                                  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                    <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                      <tr>
                                        <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                          <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                            <tr>
                                              <td class="alignment" style="vertical-align: middle; text-align: center;">
                                                <!--[if vml]>
                                                      <table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                                                        <![endif]-->
                                                <!--[if !vml]>
                                                        <!-->
                                                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                                                  <!--
                                                          <![endif]-->
                                                  <tr></tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- End -->
          </body>
        </html>`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ message: "error sending" });
          console.log(error);
        } else {
          res.status(200).json({
            message: "haw el mail wselek jawk behi erfess",
          });
          User.findOneAndUpdate(
            { email: req.body.email },
            { codeForget: RandomXCode },
            { new: true }
          )
            .then((updatedUser) => {
              console.log(updatedUser); // log the updated user document
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  }
  
  
  
   async function VerifCodeForgot(req, res, next) {
    const { email, codeForget } = req.body;
    if (!email || !codeForget) {
      return res.status(400).json({ error: "Something is missing" });
    } else {
      const user = await User.findOne({ email: req.body.email });
      console.log(req.body.email);
      console.log("Code enter by the User ==> " + req.body.codeForget);
      console.log("Code ons the Database ==> " + user.codeForget);
      
      if (req.body.codeForget == user.codeForget && user.codeForget != "") {
        return res.status(200).json({ message: "Code Has been verified!" });
      }

      if (req.body.codeForget != user.codeForget && user.codeForget != "") {
        console.log("Sorry! The code is incorrect!");
        return res.status(402).json({ message: "Sorry! The code is incorrect!" });
      }
      if (user.codeForget == "") {
        return res
          .status(401)
          .json({ message: "Sorry! There is no code in Database!" });
      }
    }
  }

  async function ChangePasswordForgot(req, res, next) {
    const { email, codeForget, password } = req.body;
    if (!email || !codeForget || !password) {
      return res.status(422).json({ error: "Something is missing" });
    } else {
      //
      const user = await User.findOne({ email: req.body.email });
      if (req.body.codeForget == user.codeForget && user.codeForget != "") {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          } else {
            user.password = hash;
            user.codeForget = "";
            user.save().then((user) => {
              return res
                .status(200)
                .json({ message: "Congratulations, Password changed!" });
            });
          }
        });
      } else {
        return res.status(402).json({ message: "Sorry! The code is incorrect!" });
      }
    }
  }




const AuthController = {
    register,
    login,
    logout,
    forgot_password,
    reset_password,
    changerMotDePasse,
    motDePasseOublie,
    ChangePasswordForgot,
    VerifCodeForgot,
    SendCodeForgot
};
export default AuthController;
