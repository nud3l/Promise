const truffleAssert = require('truffle-assertions');
const Promise = artifacts.require("Promise");

contract("Promise cost", async accounts => {
    let provider = accounts[4];
    let user = accounts[5];
    const PAYMENT = 1;
    const PERIOD = 10;
    const DEPOSIT = 1;
    const EVENT_ID = 0;
    

    it("end-to-end test", async () => {
        let promise = await Promise.deployed();
        
        // create service
        let createServiceTx = await promise.createService(PAYMENT, PERIOD, user, provider, {from: user});
        truffleAssert.eventEmitted(createServiceTx, 'ServiceCreated', (ev) => {
            return ev.id.toNumber() === EVENT_ID;
        });
        let createServiceGas = createServiceTx.receipt.gasUsed;
        console.log(`createServiceGas: ${createServiceGas}`);

        // provide deposit
        let provideDepositTx = await promise.provideDeposit(EVENT_ID, {from: provider, value: web3.utils.toWei(DEPOSIT.toString(), "ether")});
        let provideDepositGas = provideDepositTx.receipt.gasUsed;
        console.log(`provideDepositGas: ${provideDepositGas}`);

        // provide pre-payment
        let prepayment = PAYMENT * PERIOD;
        let providePrepaymentTx = await promise.providePrepayment(EVENT_ID, {from: user, value: web3.utils.toWei(prepayment.toString(), "ether")});
        truffleAssert.eventEmitted(providePrepaymentTx, 'ProvidedPrepayment', (ev) => {
            return ev.id.toNumber() === EVENT_ID && ev.amount == web3.utils.toWei(prepayment.toString(), "ether");
        });
        let providePrepaymentGas = providePrepaymentTx.receipt.gasUsed;
        console.log(`providePrepaymentGas: ${providePrepaymentGas}`);

        // provide task
        let provideTaskTx = await promise.provideTask(EVENT_ID, {from: user});
        let provideTaskGas = provideTaskTx.receipt.gasUsed;
        console.log(`provideTaskGas: ${provideTaskGas}`);

        // withdraw money
        let withdrawMoneyTx = await promise.withdrawMoney(EVENT_ID, {from: provider});
        let withdrawMoneyGas = withdrawMoneyTx.receipt.gasUsed;
        console.log(`withdrawMoneyGas: ${withdrawMoneyGas}`);

    });
})

