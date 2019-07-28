const Weather = require('./weather.model');
const Boom = require('boom');
let request = require('request');
let apiKey = '9eb5163d48067a504db532072c0d7eb4';
const fetch  = require('node-fetch');
module.exports = {
    async weatherDetailsByCityName(req, reply) {
        let city =await req.payload.cityname;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`
        try 
        {
          const response = await fetch(url);
          const json = await response.json();
          //return {message:json.message,status:json.type};
          return reply.response({response_data:json,response_code:200})
        }
        catch(error)
        {
            return reply.response({response_data:"Error occur",response_code:500})
        }
       
    }
}
