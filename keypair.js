const SHA256 = require('crypto-js/sha256');

class KeyPair{
    constructor(){
        var random = Math.floor(Math.random(1000000000000));
        this.keyPair =  SHA256(`${Date.now()}${random}`);
        this.publicKey = this.keyPair + 1;
    }

    sign(dataHash){
        return JSON.stringify(SHA256(`${this.publicKey}${dataHash}`));
    }

    static verify(publicKey, dataHash, signature){
        return JSON.stringify(SHA256(`${publicKey}${dataHash}`)) == signature;
    }

    static genKeyPair(){
        return new KeyPair();
    }
}

module.exports = KeyPair;