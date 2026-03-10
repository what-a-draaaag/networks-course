//запуск 
// node lab02/app.js 

const { error } = require("console");
const http = require("http");
const fs = require("fs");
const path = require("path");

products = []

const ICONS_DIR = 'lab02/icons';
if (!fs.existsSync(ICONS_DIR)){
    fs.mkdirSync(ICONS_DIR);
}

function getRequestData(request, isBinary = false){
    return new Promise(async (resolve, reject) => {
        try{
            const buf = []
            for await (const d of request){
                buf.push(d)
            }
            const buffer = Buffer.concat(buf)
            resolve(isBinary ? buffer : JSON.parse(buffer.toString()))
        }
        catch (error){
            reject(error)
        }
    })
}

http.createServer(async (request, response) => {

    if (request.method == "POST" && request.url.match(/\/product\/([0-9]+)\/image/)){
        const id = request.url.split("/")[2]
        const product = products.find((p) => p.id == parseInt(id))
        if (product) {
            try {
                const imageData = await getRequestData(request, true)
                const filename = `${id}.png`
                const filepath = path.join(ICONS_DIR, filename)
                fs.writeFileSync(filepath, imageData)
                product.icon = filename
                
                response.writeHead(200, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "Uploaded", icon: product.icon }))
            } catch (e) {
                response.writeHead(400, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "Upload failed." }))
            }
        }
        else{
            response.writeHead(404, { "Content-Type": "application/json" })
            return response.end(JSON.stringify({ message: "Product not found." }))
        }
    }
    else if (request.method == "GET" && request.url.match(/\/product\/([0-9]+)\/image/)){
        const id = request.url.split("/")[2]
        const product = products.find((p) => p.id == parseInt(id))

        if (!product || !product.icon) {
            response.writeHead(404, { "Content-Type": "application/json" })
            return response.end(JSON.stringify({ message: "Image not found." }))
        }

        const filepath = path.join(ICONS_DIR, product.icon)
        if (!fs.existsSync(filepath)) {
            response.writeHead(404, { "Content-Type": "application/json" })
            return response.end(JSON.stringify({ message: "File missing." }))
        }

        const ext = path.extname(product.icon).substring(1)
        response.writeHead(200, { "Content-Type": `image/${ext}` })
        response.end(fs.readFileSync(filepath))
    }
    else if (request.url == "/product" && request.method == "GET"){
        response.end(JSON.stringify(products))
    } 
    else if (request.url.match(/\/product\/([0-9]+)/) && request.method === "GET") {
        const id = request.url.split("/")[2]
        const product = products.find((p) => p.id === parseInt(id))
        if(product) 
            response.end(JSON.stringify(product))
        else{
            response.writeHead(404, { "Content-Type": "application/json" })
            response.end(JSON.stringify({ message: "Product not found." }))
        }
    }
    else if (request.url.match(/\/product\/([0-9]+)/) && request.method === "DELETE") {
        const id = request.url.split("/")[2]
        const productIdx = products.findIndex((p) => p.id == parseInt(id))
        if(productIdx > -1){
            const product = products.splice(productIdx, 1)[0]
            if(product.icon) {
                const filepath = path.join(ICONS_DIR, product.icon)
                if(fs.existsSync(filepath)) fs.unlinkSync(filepath)
            }
            response.end(JSON.stringify(product))
        }
        else{
            response.writeHead(404, { "Content-Type": "application/json" })
            response.end(JSON.stringify({ message: "Product not found." }))
        }
    }
    else if (request.method == "PUT" && request.url.match(/\/product\/([0-9]+)/)){
        try{
            const id = request.url.split("/")[2]
            const productData = await getRequestData(request)
            const product = products.find((p) => p.id === parseInt(id))
            if (product){
                product.name = productData.name!=null ?productData.name:product.name
                product.description = productData.description!=null ?productData.description:product.description
                response.end(JSON.stringify(product))
            }
            else{
                response.writeHead(404, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ message: "Product not found." }))
            }
        }
        catch(error){
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Invalid data, product not updated." }));
        }
    }
    else if (request.method == "POST" && request.url == "/product"){
        try{
            const productData = await getRequestData(request)
            if (productData.name == null || productData.description == null)
                throw error
            id = Math.max(Math.max.apply(Math,products.map(function(p){return p.id;})),0)
            const product = {id: id+1, name: productData.name, description: productData.description, icon: null}
            products.push(product)
            response.end(JSON.stringify(product))
        }
        catch(error){
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Invalid data, product not added." }));
        }
    }
    
}).listen(3000, function(){ console.log("http://localhost:3000")});