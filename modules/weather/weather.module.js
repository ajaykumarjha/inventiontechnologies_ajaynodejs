
const weatherRoutes = require('./weather.routes');
const WeatherModule = {
    name: 'WeatherModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(weatherRoutes);
    }
};
module.exports = WeatherModule;