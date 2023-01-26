const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");
const truffleAssert = require('truffle-assertions');
const fs = require('fs');

contract('DoublePriceAuction -> Test Sort', (accounts) => {
  for(let i=0;i<100;i++) {
    let aux = ''
    it(`should add ${i} bidder`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      await doublePriceAuctionInstance.registerBid(Math.floor(Math.random() * 1000), 59, {from: accounts[i]});
    });
    
    it(`should sort for ${i} bidder`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      let spend = new Date();
      let tx = await doublePriceAuctionInstance.getSortedBids();
      let spend_time = new Date().getTime() - spend.getTime()
      aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
      fs.appendFile('sort.csv', aux, err => {
        if (err) {
          console.error(err)
        }
      });
    });
  }
});
