const {INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');


class Wallet {
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
       // this.publicKey = this.keyPair.getPublic().encode('hex');
       this.publicKey = this.keyPair.publicKey;
    }

    toString(){
        return `Wallet -
            publicKey: ${this.publicKey.toString()}
            balance  : ${this.balance.toString()}`
    }

    sign(datahash){
        return this.keyPair.sign(datahash);
    }
}

module.exports = Wallet;