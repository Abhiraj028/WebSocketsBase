import {WebSocketServer, WebSocket} from "ws";

const ws = new WebSocketServer({port: 8080});

interface userInterface {
    socket: WebSocket;
    roomId: string 
}

const allSockets: userInterface[] = [];

ws.on("connection",(socket) => {
    socket.on("message",(message) => {
        const parsedMsg = JSON.parse(message.toString());

        if(parsedMsg.type == "join"){
            const roomId = parsedMsg.payload.roomId;
            allSockets.push({socket,roomId});
            console.log(parsedMsg.payload.name+" joined");
            return;
        }

        if(parsedMsg.type == "chat"){
            console.log("inside chat");
            const senderRoom = allSockets.filter(sc => sc.socket == socket);
            const sender = senderRoom[0];
            console.log(parsedMsg.payload.msg);

            if(!sender){
                return; 
            }
            allSockets.forEach(s => {
                if(sender.roomId == s.roomId){
                    s.socket.send(parsedMsg.payload.name+" sent: "+parsedMsg.payload.msg);
                }
            });
            return;
        }
    });

    socket.on("close",() =>{
        allSockets.filter(s => s.socket != socket);
    });


});


// {
//     type: "chat",
//     payload: {
//         name: "bludsher",
//         msg: "this is my message"
//     }
// }

// {
//     type: "join",
//     payload: {
//         name: "wowowow",
//         roomId: "34343"
//     }
// }