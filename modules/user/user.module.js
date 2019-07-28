
const userRoutes = require('./user.routes');
const UserModule = {
    name: 'UserModule',
    version: '1.0.0',
    register: async function (server, options) {
        server.route(userRoutes);
    }
};
module.exports = UserModule;