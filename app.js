const express = require("express");
import { engine } from "express-handlebars";
import __dirname from "./src/utils/utils.js";
import * as path from "path";
const http = require('http');
const socketIO = require('socket.io');


const { productsRouter } = require("./src/routes/products.routes.js");
const { cartsRouter } = require("./src/routes/carts.routes.js");


const app = express();
const port = 8080;

//Configuración de Socket.IO
const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', (socket) =>{ 
	console.log('New client connected')});

	
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Estructura Handlebars
// ////////////////////   //////////////////////// //
app.engine("Handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
// ////////////////////   //////////////////////// //

app.get("/", (req , res)=>{
	res.render("home", )
	title: "backend * handlebars"
})

//  API endpoints

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProductsRouter)

//  API endpoints

app.listen(port, () => {
	console.log(`Server running in http://localhost:${port}`);
});