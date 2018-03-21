const ChainUtil = require('../chain-util');

class Transaction{
    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount){
        //add new output, new amount, new recipient, new signature
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if(amount > senderOutput.amount){
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount, address: recipient});
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

    static newTransaction(senderWallet, receipient, amount){
        //return new instance of transaction with proper input and output
        const transaction = new this();
        if (amount > senderWallet.balance){
            console.log('Amount: ${amount} exceeds balance.')
            return;
        }

        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey}, //output return to sender
            { amount, address: receipient} //amount is the same as given... output to recipient
        ])

        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,
            ChainUtil.hash(transaction.outputs),
            transaction.input.signature
        )
    }
}

module.exports = Transaction;