const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");
const truffleAssert = require('truffle-assertions');
const fs = require('fs');

contract('DoublePriceAuction', (accounts) => {
  
  for(let i=0;i<23;i++) {
    it(`should add ${i} bidder and ${i} Offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      await doublePriceAuctionInstance.registerBid(100, 59, {from: accounts[i]});
      await doublePriceAuctionInstance.placeBid(10, {from: accounts[i]});
      await doublePriceAuctionInstance.transfer(accounts[i], 10);
      await doublePriceAuctionInstance.registerOffer(i+1, 1, {from: accounts[i]});
    });
    // if (i >= 25) {
      it(`should run trade for ${i} bidder and ${i} Offer`, async () => {
        let aux = ''
        await new Promise(r => setTimeout(r, 1000*i));
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        let spend = new Date();
        let tx = await doublePriceAuctionInstance.trade();
        let spend_time = new Date().getTime() - spend.getTime()
        aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
        fs.appendFile('trade.csv', aux, err => {
          if (err) {
            console.error(err)
            return
          }
        });

      });
    // }
  }
});
