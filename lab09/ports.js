//запуск в папке lab09 командой 
// node ports.js 127.0.0.1 8000 8010

const net = require("net");

const [ip, a, b] = process.argv.slice(2);

for (let port = +a; port <= +b; port++) {
    const server = net.createServer();

    server.once("error", () => {});
    server.listen(port, ip, () => {
        console.log(port);
        server.close();
    });
}