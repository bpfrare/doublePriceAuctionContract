const DoublePriceAuction = artifacts.require("DoublePriceAuctionLocation");
const fs = require('fs');

contract('DoublePriceLocation -> Set Location', (accounts) => {
  for(let i=0;i<100;i++) {
    let aux = ''
    let cost = 0;
    it(`should add ${i} bidder and offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      let tx;
      tx = await doublePriceAuctionInstance.registerBid(i+1, 1, {from: accounts[i]});
      cost += tx.receipt.gasUsed;
      tx = await doublePriceAuctionInstance.registerOffer(i+1, 1, {from: accounts[i]});
      cost += tx.receipt.gasUsed;
    });
    
    it(`should set location for ${i} bidder and offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      let spend = new Date();
      let tx = await doublePriceAuctionInstance.setLocation(-23163217000, -45794390000, {from: accounts[i]});
      let spend_time = new Date().getTime() - spend.getTime()
      cost += tx.receipt.gasUsed;
      aux = (i+1).toString() + ';' + spend_time.toString() + ';' + cost.toString() + '\r\n';
      fs.appendFile('./results/location/registerBidders.csv', aux, err => {
        if (err) {
          console.error(err)
        }
      });
    });
  }
});