const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const jwt = require('jsonwebtoken');
const HapiMongoose = require('hapi-mongoose-connection');
const Promise = require('bluebird');
const config = require('./config/development');
            //*****module routes******* 
const UserModule = require('./modules/user/user.module');
const WeatherModule = require('./modules/weather/weather.module');
const logger = require('./services/logger');

//*****server setup****
(async () => {
    const server = await new Hapi.Server({
        host: config.host,
        port: process.env.PORT || config.port,
        routes: { cors: true }
    });
    const swaggerOptions = {
        info: {
            title: 'documentation',
            version: Pack.version,
        },
    };
    const goodOptions = {
        ops: {
            interval: 1000
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{log: '*', response: '*'}]
            }, {
                module: 'good-console'
            }, 'stdout'],
            myFileReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ ops: '*' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson'
            }, {
                module: 'good-file',
                args: ['awesome_log']
            }]
        }
    };
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        },
        {
            plugin: HapiMongoose,
            options: {
                uri: config.mongodbURI,
                promise: Promise
            }
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        },
        {
            plugin: require('good'),
            options: goodOptions
        },
        require('hapi-auth-jwt2'),
        UserModule,
        WeatherModule
    ]);
    console.log(`http://${server.info.host}:${server.info.port}/documentation#/`);
    await server.start(err => {
        if (err) {
            console.log("error..."+err);
            throw err;
        }
        server.auth.strategy('jwt','jwt',{
           key: config.secret,
           verifyOptions:{
               algorithm: ['HS256']
           },
           validateFunc: JwtService.validate
        });
        server.auth.default('jwt');
    });
})();