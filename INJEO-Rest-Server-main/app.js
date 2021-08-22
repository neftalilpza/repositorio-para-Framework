//primero van las dependencias de node
//despues las de tercero 
//despues la propias
require('dotenv').config();
const Server = require('./models/server');


const server = new Server();



server.listen();