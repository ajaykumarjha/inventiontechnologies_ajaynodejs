var loopback=require('loopback');
var nodemailer=require('nodemailer');
var path   = require("path");

let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 587,
    //secure: true, // use SSL
    auth: {
        user: 'XXXXXXXXXXXXXX',
        pass: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    }
});

module.exports={

    mail(data){
        console.log("enter")
        return new Promise(function(resolve,reject){
            var render = loopback.template(path.resolve(__dirname, '../views/discoveremail1.ejs'));
            var html_body = render(data);
            console.log("enter")
            let mailOptions = {
                from: 'info@wichapp.co.uk',
                to: [data.email,"rite2dinesh@gmail.com"],
                subject: 'booking swizerland.',
                text: 'discover swizerland booking.',
                html: html_body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                }
                else{
                    console.log("enter")
                    resolve("success")
                } 
            });
        })
    },
    
    mailstatus(randomNo,status){
        var otpNumber = { 
            otp: randomNo ,
            productUrl:"http://www.productUrl.com"
        };

        var render = loopback.template(path.resolve(__dirname, '../../views/forget_password_template.ejs'));
        var html_body = render(otpNumber);
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'info@wichapp.co.uk',
            to: req.payload.email,
            subject: 'swizerland booking.',
            text: 'discover swizerland booking',
            html: html_body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else{
                console.log("success.");
            } 
        });
    },
    contactusEmail(mail,data){
        var otpNumber = { 
            name:data.name,
            email:data.email,
            contact:data.contactNumber,
            message:data.message
        };
        var render = loopback.template(path.resolve(__dirname, '../views/discoveremail2.ejs'));
        var html_body = render(otpNumber);
        let mailOptions = {
            from: 'info@XXXX.XX.uk',
            to: [mail,"XXXXXX@gmail.com"],//email,//req.payload.email,
            subject: 'booking swizerland.',
            text: 'discover swizerland booking.',
            html: html_body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else{
                resolve("success")
            } 
        });
    }
}