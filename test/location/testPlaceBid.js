const DoublePriceAuctionLocation = artifacts.require("DoublePriceAuctionLocation");
const fs = require('fs')

contract('DoublePriceAuctionLocation', (accounts) => {

  it('should register Bidder and update', async () => {
      const doublePriceAuctionInstance = await DoublePriceAuctionLocation.deployed();
      for(let i=0;i<100;i++) {
        let tx = await doublePriceAuctionInstance.registerBid(i+1, (i+1), {from: accounts[i]});
        let spend = new Date();
        tx = await doublePriceAuctionInstance.placeBid(i+1, {from: accounts[i]});
        let spend_time = new Date().getTime() - spend.getTime()
        console.log(i, tx.receipt.gasUsed);
        let aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
        fs.appendFile('results/location/placeBid.csv', aux, err => {
          if (err) {
            console.error(err)
            return
          }
        });
      }
  }); 
});