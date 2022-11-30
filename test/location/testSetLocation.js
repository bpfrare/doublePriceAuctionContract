const DoublePriceAuction = artifacts.require("DoublePriceAuctionLocation");
const fs = require('fs');

contract('DoublePriceLocation -> Set Location', (accounts) => {
  for(let i=0;i<100;i++) {
    let aux = ''
    it(`should add ${i} bidder and offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      await doublePriceAuctionInstance.registerBid(i+1, 1, {from: accounts[i]});
      await doublePriceAuctionInstance.registerOffer(i+1, 1, {from: accounts[i]});
    });
    
    it(`should set location for ${i} bidder and offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      let spend = new Date();
      let tx = await doublePriceAuctionInstance.setLocation(-23163217000, -45794390000, {from: accounts[i]});
      let spend_time = new Date().getTime() - spend.getTime()
      aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
      fs.appendFile('./results/location/setLocation.csv', aux, err => {
        if (err) {
          console.error(err)
        }
      });
    });
  }
});