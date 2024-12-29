import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors"
const PORT = 3000;
const app = express();

const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials: true
    }
});
app.use(cors())
app.get("/", (req,res)=>{
    res.send("Hello")
})

io.on("connection", (socket) =>{
    console.log("User Connected->",socket.id);
    // console.log("Id");
    
    // console.log(("Id->", socket.id));
    socket.emit("welcome",`Welcome to the server!!! ${socket.id}`)

    // socket.broadcast.emit("welcome",`${socket.id} Join the server`)
    socket.on("message",({room,message})=>{
        // console.log(data);
        // io.emit("receive-message",data)
        // socket.broadcast.emit("receive-message",data) 
        io.to(room).emit("receive-message",message)        
    })
    socket.on("join-room", (room)=>{
        socket.join(room);
    })
    socket.on("disconnect",()=>{
        console.log("User Disconnected", socket.id);
        
    })
    
})

server.listen(PORT,()=>{
    console.log(`Running at port ${PORT}`);
})
