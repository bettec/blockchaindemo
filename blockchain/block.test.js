const Block = require('./block');
const { DIFFICULTY } = require('../config');

describe('Block', () =>{
    let data, lastBlock, block;

    beforeEach(()=>{
        data = 'boo';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    }); //`` means special variable in string

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates a hash that matches the difficulty', ()=>{
        //need access difficulty variable, declare constant that can be accessed by this file and Block.js
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));    
       // console.log(block.toString());    
    });

    it('lowers the difficulty for slowly mined blocks', () =>{
        expect(Block.adjustDifficulty(block, block.timestamp+360000)).toEqual(block.difficulty-1);
    });

    it('raises the difficulty for quickly mined blocks', ()=>{
        expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1);
    });
});