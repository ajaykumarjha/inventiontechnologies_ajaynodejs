var winston = require('winston');

var logger = winston.createLogger({
    level: 'debug',
    transports :  [
        new winston.transports.Console({
            'timestamp': true,
            'colorize': true
        })
    ]
});

module.exports = logger;