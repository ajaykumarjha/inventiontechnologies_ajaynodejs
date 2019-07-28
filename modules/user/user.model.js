var mongoose = require('mongoose')
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName:{
        type: String
    },
    lastName:{
        type:String
    },
    password:{
        type: String
    },
    mobileNumber:{
        type: String
    },
    role:{
        type:String,
        default:'user'
    },
    email:{
        type: String
    },
    passportNumber:{
        type:String
    },
    DOB:{
        type:String
    },
    createdAt:{
        type: Number,
        default:Date.now()
    },
    updatedAt:{
        type: Number,
        default:Date.now()
    },
    },{
    versionKey: false 
});
module.exports = mongoose.model('User', UserSchema);