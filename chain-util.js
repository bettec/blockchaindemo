const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); //bitcoin uses this standard
const uuidV1 = require('uuid/v1');
const KeyPair = require('./keypair');
const SHA256 = require('crypto-js/sha256');

class ChainUtil {
    static genKeyPair(){
        //return ec.genKeyPair();
/*         var random = Math.floor(Math.random(1000000000000));
        return SHA256(`${Date.now()}${random}`); */
        return KeyPair.genKeyPair();
    }

    static id(){
        return uuidV1(); //uuidV1 is a function imported
    }

    static hash (data){
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, dataHash, signature){
        return KeyPair.verify(publicKey, dataHash, signature);
        //return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}

module.exports = ChainUtil;