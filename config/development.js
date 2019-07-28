var ip = require("ip");
console.log(process.env.NODE_ENV);
module.exports = {
    host:ip.address()?ip.address():"0.0.0.0",
    port: '9000', 
    secret: '12MUUAS#$%',
    mongodbURI: process.env.NODE_ENV=="production"?"mongodb://localhost:27017/inventiotechnologies_prod":"mongodb://localhost:27017/inventiotechnologies_dev"
}
