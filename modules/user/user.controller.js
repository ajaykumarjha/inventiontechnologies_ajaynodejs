const User = require('./user.model');
const Boom = require('boom');
const UtilService = require('../../services/util.service');
const JwtService = require('../../services/jwt.service');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var loopback=require('loopback');
//please change the nodemailer credential
let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 587,
    //secure: true, // use SSL
    auth: {
        user: 'XXXXXXXXXXXX',
        pass: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    }
});

module.exports = {
    async create(req, reply) {
        try {
            const isExist = await User.findOne({role:"admin"});
            if(isExist){
                return reply.response({response_data:"admin already exists",response_code:200})
            }
            else{
                const user = new User(req.payload);
                user.password = await UtilService.hashPassword(user.password);
                const saved=await user.save();
                return reply.response({response_data:'Data has been saved successfully.',response_code:200});
            }
        }
        catch(err){
            if(err.code==11000){
                return reply.response({response_data:"email already exists.try with other email.",response_code:500})
            }
            return reply.response({response_data:"Error occur",response_code:500})
        }
    },
    async login(req, reply){
        try {
            const user = await User.findOne({email: req.payload.email});
            if (!user) {
                return reply.response({response_data:"Email not registered.",response_code:500});
            }
            const matched = await UtilService.comparePassword(req.payload.password, user.password);
            if(matched){
               const token = JwtService.issue({
                    payload:{
                        id: user._id,
                        email: user.email,
                        role:user.role
                    },
                    expiresIn : '1 day'
                });
                return reply.response({response_data:token,response_code:200});
            }
            else{
                return reply.response({response_data:"Incorrect password.",response_code:500});
            }
        }
        catch(err){
            throw Boom.unauthorized(err);
        }
    },
    async me(req,reply){
        try{
            var token=req.headers.authorization;
            var decode=JwtService.decodeToken(token);
            console.log("ok")
            if(decode.id){
                const user=await User.findById(decode.id,'-password');
                if(!user){
                    return reply.response({response_data:"user not registered.",response_code:500});
                }
                else{
                    return reply.response({response_data:user,response_code:200});
                }
            }
            else{
                return reply.response({message:'You are not authorized.',response_code:401})
            }
        }
        catch(err){
            throw(err)
        }
    },
    async updatePassword(req,reply){
        try{
            const user=await User.findById(req.params.id,'-__v');
            if(req.payload.newPassword==req.payload.oldPassword){
                return reply.response({message:"oldPassword and newPassword should not be same.",response_code:400})
            }
            if(await UtilService.comparePassword(req.payload.oldPassword,user.password)){
                user.password = await UtilService.hashPassword(req.payload.newPassword);
                await user.save();
                return reply.response({message:"newPassword successfully updated.",response_code:200});
            }
            else{
                return reply.response({message:"oldPassword is incorrect",response_code:400});
            }
        }
        catch(err){
            throw Boom.unauthorized('invalid credentials',err);
        }
    },
    sentMailForgetPassword(req, reply) {
        User.findOne({email:req.payload.email}).exec(function(err,user){
            if(err){
                return reply.response("error occured")
            }
            if(!user){
                return reply.response({message:"email does not exist",response_code:500});
            }
            else{
                var randomNum = Math.floor(Math.random() * 900000) + 100000;
                user.forgetPasswordNumber=randomNum;
                user.save(function(err){
                    if(err){
                        return reply.response({message:"error occured",response_code:500});
                    }
                    var otpNumber = { otp: randomNum ,productUrl:"http://www.productUrl.com"};
                    var render = loopback.template(path.resolve(__dirname, '../../views/forget_password_template.ejs'));
                    var html_body = render(otpNumber);
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: 'info@wichapp.co.uk',
                        to: req.payload.email,
                        subject: 'Hello ✔',
                        text: 'Hello world?',
                        html: html_body
                    };
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        const token = JwtService.issue({
                            payload:{
                                id: user._id,
                                email: user.email
                            },
                            expiresIn : '1 day'
                        });
                        return reply.response({token:token,response_code:200,message:"mail successfully sent to valid email"});
                        });
                    })
                }
            })
        },
        otpVerification(req,reply){
            var token=req.headers.authorization;
            var decode=JwtService.decodeToken(token);
            User.findOne({email:decode.email}).exec(function(err,user){
                if(err){
                    return reply.response({message:"Error occured",status_code:500,response_code:500});
                }
                if(!user){
                    return reply.response({message:"No user found",status_code:400,response_code:400});
                }
                else{
                    if(user.forgetPasswordNumber==req.payload.otp){
                        const token = JwtService.issue({
                            payload:{
                                id: user._id,
                                email: user.email
                            },
                        expiresIn : '5 min'
                        });
                        return reply.response({token:token,message:"otp is verified.",response_code:200})
                    }
                    else{
                        return reply.response({message:"otp mismatched",response_code:500});
                    }
                }
            })
        },
        async resetPassword(req,reply){
            var token=req.headers.authorization;
            var decode=JwtService.decodeToken(token);
            try{
                var user=await User.findOne({email:decode.email});
                if (!user) {
                    reply(Boom.unauthorized({message:'email doesnot exist',response_code:400}));
                }
                user.password=await UtilService.hashPassword(req.payload.newPassword);
                user.forgetPasswordNumber = Math.floor(Math.random() * 900000) + 100000;
                await user.save();
                const token = JwtService.issue({
                    payload:{
                        id: user._id,
                        email: user.email
                    },
                    expiresIn : '1 day'
                });
                return reply.response({token:token,message:"password successfully changed",response_code:200});
            }
            catch(err){
                throw Boom.badImplementation('invalid credentials',err);
            }
        }
   
}
