var mongoose = require('mongoose')
const Schema = mongoose.Schema;
const WeatherSchema = new Schema({
   
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
module.exports = mongoose.model('Weather', WeatherSchema);