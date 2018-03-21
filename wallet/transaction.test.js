const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', ()=>{
    let transaction, wallet, recipient, amount;

    beforeEach(() =>{
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', ()=>{
        //look for each element in outputs, find the one whose address field matches the wallet's publicKey
        transaction = Transaction.newTransaction(wallet, recipient, amount);
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });

    it('output the `amount` added to the recipient', ()=>{
        transaction = Transaction.newTransaction(wallet, recipient, amount);
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    });

    it('inputs the balance of the wallet', ()=>{
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validate a valid transaction', ()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('validate corrupted transaction', ()=>{
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('updating a transaction', ()=>{
        let nextAmount, nextRecipient;

        beforeEach( ()=> {
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr335';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it(`subtracts the next amount from sender's output`, ()=>{
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', ()=>{
            expect(transaction.outputs.find(output=> output.address === nextRecipient).amount)
                .toEqual(nextAmount);
        });
    });
});