const fs = require('fs');
let contract = require('@truffle/contract')
let DoublePriceAuctionContract = contract(require('../build/contracts/DoublePriceAuctionContract.json'))

module.exports = async function(callback) {
  let accounts = await web3.eth.getAccounts();
  
  DoublePriceAuctionContract.setProvider(web3.currentProvider);
  let instance = await DoublePriceAuctionContract.deployed();
  

  for(let i=28;i<35;i++) {
    console.log(i);
    console.log(accounts[i]);
    let balance = await web3.eth.getBalance(accounts[i]);
    console.log(balance);
    // await instance.registerBid(100, 59, {from: accounts[i]});
    console.log("registerBid");
    // await instance.placeBid(10, {from: accounts[i]});
    console.log("placeBid");
    if (i > 0) {
      // await instance.transfer(accounts[i], 10, {from: accounts[0]});
    }
    console.log("transfer");
    await instance.registerOffer(i+1, 1, {from: accounts[i]});
    console.log("registerOffer");

    // Run
    let aux = ''
    let spend = new Date();
    let tx = await instance.trade({from: accounts[0]});
    console.log("trade");
    let spend_time = new Date().getTime() - spend.getTime()
    aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
    fs.appendFile('./results/sepolia/trade.csv', aux, err => {
      if (err) {
        console.error(err)
        return
      }
    });
    console.log(aux);

  }
  // invoke callback
  callback();
}