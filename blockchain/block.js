const ChainUtil = require('../chain-util');
const {DIFFICULTY, MINE_RATE} = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){ //attach attributes to initialize the class
        this.timestamp = timestamp; //this is an instance of this class
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY; //if difficulty not given by constructor (genesis block), set it to default
    }

    toString(){ //describes the class, and good for debugging
        //diagonal ticks and single quote
        return `Block -     
          Timestamp : ${this.timestamp}
          Last Hash : ${this.lastHash.substring(0,10)}
          Hash      : ${this.hash.substring(0,10)} 
          Nonce     : ${this.nonce}
          Difficulty: ${this.difficulty}
          Data      : ${this.data}`; 
    }

    static genesis(){ // use this without creating a Block instance
        return new this('Genesis Time', '------', 'f1r5t-h45h', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
        let hash, timestamp;        
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock; //E6 syntax: let difficulty = lastBlock.difficulty

        //proof of work has to meet difficulty level, nonce is used to generate hash, it will be incremented until 
        let nonce = 0;
        //hash = Block.hash(timestamp, lastHash,data, nonce);
         do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash,data, nonce, difficulty);
        }while(hash.substring(0, difficulty) !== '0'.repeat(difficulty)); //substring(0, 4) of the hash 01xrw3gjls = 01xr 
        // compare this to '0'repeat 4 times
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const {timestamp,lastHash, data, nonce, difficulty} = block; // grab variables from this block
        return Block.hash(timestamp, lastHash, data, nonce, difficulty); // use these variables in the hash
    }

    static adjustDifficulty(lastBlock, currentTime){
        let {difficulty} = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;