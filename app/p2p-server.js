const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []; // a list of web sockets address

//$ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001, ws://localhost:5002 rpm run dev

class P2pServer{
    constructor(blockchain){ //give each p2p server blockchain to share with each other
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen(){ //create web socket server
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));//listening to connection event, whenever new connection 
        //call back functions to interact with the connection
        this.connectToPeer();
        console.log(`Listening to peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectToPeer(){
        peers.forEach(peer => { // forEach have a call back function to run code on each element
            // ws://localhost:5001
            const socket = new WebSocket(peer);
            socket.on('open', ()=> this.connectSocket(socket));
        });
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket); //socket is now ready to receive message events
        this.sendChain(socket);
    }

    messageHandler(socket){ // event listener
        socket.on('message', message =>{ // chain the on method, trigger by the on function, and call back methods
            const data = JSON.parse(message);
            //console.log('data', data);
            this.blockchain.replaceChain(data); //validate
        });
    }

    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain)); //
    }

    syncChains(){ //send the updated chain from this socket to others --> broadcast
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}
module.exports = P2pServer;