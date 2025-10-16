import { Server as SocketIOServer } from "socket.io";
import http from "http"


export const initSocketServer = (server:http.Server)=>{
    const io = new SocketIOServer(server);

    io.on("connection",(socket)=>{
        console.log("A user connected");
   
    // listen for notificaton event from the frontend
    socket.on("notification",(data)=>{
        // Broadcast the notification data to all connected client (admin dashbaord)
        io.emit("newNotification",data)
    });
    socket.on("disconnect",()=>{
        console.log("A user is disconnected")
    })
    })

}
