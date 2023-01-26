const DoublePriceAuctionLocation = artifacts.require("DoublePriceAuctionLocation");
const fs = require('fs');

contract('DoublePriceAuction', (accounts) => {

  let temp = {lat: -23.163217, lng: -45.794390}
  
  for(let i=0;i<30;i++) {
    it(`should add ${i} bidder and ${i} Offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuctionLocation.deployed();
      await doublePriceAuctionInstance.registerBid(100, 59, {from: accounts[i]});
      await doublePriceAuctionInstance.placeBid(10, {from: accounts[i]});
      await doublePriceAuctionInstance.transfer(accounts[i], 10);
      await doublePriceAuctionInstance.registerOffer(i+1, 1, {from: accounts[i]});
      
      let temp_s = {lat: Math.round((temp.lat * 10**9)), lng: Math.round((temp.lng * 10**9))};
      await doublePriceAuctionInstance.setLocation(temp_s.lat, temp_s.lng, {from: accounts[i]});
      
      temp.lat -= 0.01;
      temp.lng -= 0.01;

    });
    it(`should run trade for ${i} bidder and ${i} Offer`, async () => {
      let aux = ''
      await new Promise(r => setTimeout(r, 1000*i));
      const doublePriceAuctionInstance = await DoublePriceAuctionLocation.deployed();
      let spend = new Date();
      let tx = await doublePriceAuctionInstance.trade();
      let spend_time = new Date().getTime() - spend.getTime()
      aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';

      fs.appendFile('./results/location/trade.csv', aux, err => {
        if (err) {
          console.error(err)
          return
        }
      });

    });
  }
});
