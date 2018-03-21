const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001; //allow user specify port
const P2pServer = require('./p2p-server');

// $ HTTP_PORT=3002 npm run dev // this is what can be run on command line to specify port other than 3001

const app = express(); // creates Express application
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json()); //allow receive json within post request


app.get('/blocks', (req, res)=>{  //an api method exposed. e.g. localhost:3001/blocks will return a blocks
    res.json(bc.chain);
});


app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data); //assume there's a data field in the body object, user send this to us
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains(); //broadcast new chains to the network

    //respond to user the updated block info
    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
