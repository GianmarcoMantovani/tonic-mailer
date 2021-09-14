const express = require('express');
var request = require('request');
var http = require('http');
var https = require('https');
var fs = require('fs');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const environments = require('./environments.json');
const multer = require('multer');

let enviroment = environments.dev;
if(process && process.argv && process.argv[2] && process.argv[2] == 'staging'){
  enviroment = environments.staging;
}
if(process && process.argv && process.argv[2] && process.argv[2] == 'prod'){
  enviroment = environments.prod;
}

const app = express();
if(enviroment.https){
  var sslOptions = {
    key: fs.readFileSync('/var/www/certs/tonic3/tonic3.com.key', 'utf8'),
    // cert: fs.readFileSync('/var/www/certs/tonic3/gd_bundle-g2-g1.crt', 'utf8'),
    cert: fs.readFileSync('/var/www/certs/tonic3/4d29a2e73c318dd3.crt', 'utf8'),
    requestCert: false,
    rejectUnauthorized: false
  };
  // console.log('SSL:', sslOptions);
  https.createServer(sslOptions, app).listen(enviroment.port);
} else {
  http.createServer(app).listen(enviroment.port);
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// for parsing multipart/form-data
var upload = multer({dest:'./upload/'});
app.use(express.static('public'));



const smtpConfig = { 
  auth: {
    user: 'gms.no-reply@w3americas.com', 
    pass: 'noheyicynfhanxwt'
  },
  host: 'smtp.gmail.com',
  port: 587,  
  secure: false
};

const mailOptions = {
  from: 'no-reply Tonic3<no-reply@w3americas.com>',
  to: enviroment.email,
  subject: 'Tonic3 - Contact',
  text: 'Body mail'
};
                                      
app.post('/', function (req, res) {
  const { name, email, phone, interest, message, recaptchaToken } = req.body;  
  
  mailOptions.text = `Name: ${name}\r\nEmail: ${email}\r\nPhone: ${phone}\r\nInterest: ${interest}\r\nMessage: ${message}`;
  

  // SENDING MAIL WITHOUT CAPTCHA VERIFICATION
  const transporter = nodeMailer.createTransport(smtpConfig);
  transporter.sendMail(mailOptions, function(error, info){
    if(error) res.json({ "success" : false });
    else res.json({ "success" : true });
  });



  // let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + enviroment.recaptcha_secret_key + "&response=" + recaptchaToken;
 
  // request(verificationUrl,function(error,response,body) {
  //   body = JSON.parse(body);
  //   if(body.success !== undefined && !body.success) {
  //     return res.json({"success" : false, "type": "captcha", "message" : "Failed captcha verification"});
  //   }
  //   else if(body.success){
  //     const transporter = nodeMailer.createTransport(smtpConfig);
  //     transporter.sendMail(mailOptions, function(error, info){
  //       if(error) res.json({ "success" : false, "type": "smtp", "message": "Failed to send email" });
  //       else res.json({ "success" : true });
  //     });
  //   }
  // });
  
  
  
})

app.post('/carrers', upload.single('file'), function (req, res) {
  const { name, email, phone, linkedin } = req.body;  
  mailOptions.subject = 'Tonic3 - Carrers';
  mailOptions.text = `Name: ${name}\r\nEmail: ${email}\r\nPhone: ${phone}\r\nlinkedin: ${linkedin}\r\n`;
  console.log(req.file);
  if(req.file){
    mailOptions.attachments = [
      {
          filename: req.file.originalname,
          path: req.file.path
      }
    ]
  }
  
  const transporter = nodeMailer.createTransport(smtpConfig);
   transporter.sendMail(mailOptions, function(error, info){
    if(error) res.json({ "success" : false });
    else res.json({ "success" : true });
  });
})

app.get('/', function (req, res) {
  let protocol = enviroment.https ? 'https' : 'http';
  console.log(`MAILER Express server listening on ${protocol}://${enviroment.host}:${enviroment.port}`);
  if(process && process.argv && process.argv[2])
    res.send(`tonic mailer smtp: ${process.argv[2]}`);
});
