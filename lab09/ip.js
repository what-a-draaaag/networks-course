//запуск в папке lab09 командой 
// node ip.js

const os = require("os");

const interfaces = os.networkInterfaces();

for (const name in interfaces) {
    for (const net of interfaces[name]) {
        if (net.family === "IPv4" && !net.internal) {
        console.log("IP-адрес:", net.address);
        console.log("Маска сети:", net.netmask);
        }
    }
}
