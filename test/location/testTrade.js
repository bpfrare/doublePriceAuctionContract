const DoublePriceAuctionLocation = artifacts.require("DoublePriceAuctionLocation");
const fs = require('fs');

contract('DoublePriceAuctionLocation', (accounts) => {
  
    it(`should add bidder and Offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuctionLocation.deployed();
      for(let i=0;i<100;i++) {
        await doublePriceAuctionInstance.registerBid(1, 59, {from: accounts[i]});
        await doublePriceAuctionInstance.placeBid(10, {from: accounts[i]});
        await doublePriceAuctionInstance.transfer(accounts[i], 10);
        await doublePriceAuctionInstance.registerOffer(i+2, 1, {from: accounts[i]});
        await doublePriceAuctionInstance.placeOffer(1, {from: accounts[i]});
      
        let spend = new Date();
        let tx = await doublePriceAuctionInstance.trade();
        let spend_time = new Date().getTime() - spend.getTime()
        let aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
        fs.appendFile('./results/location/trade.csv', aux, err => {
          if (err) {
            console.error(err)
            return
          }
        });
      }
    });
});
