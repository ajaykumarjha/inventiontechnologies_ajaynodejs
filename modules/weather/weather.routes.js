const WeatherController = require('./weather.controller');
const Joi = require('joi');
module.exports = [
    {
        path: '/weather/by/cityname',
        method: 'POST',
        config: {
            handler: WeatherController.weatherDetailsByCityName,
            validate: {
                payload: Joi.object().keys({
                    cityname       : Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover()
                },
            },
            description: 'get weather details by city name',
            tags: ['api','weather'],
            notes: 'returns city weather details',
            auth: false
        }
    }
];
