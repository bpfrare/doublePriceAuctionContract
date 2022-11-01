const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");
const fs = require('fs');

contract('DoublePriceAuction -> Test MCP', (accounts) => {
  for(let i=0;i<1;i++) {
    it(`should add ${i} bidder and offers`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      await doublePriceAuctionInstance.registerBid(Math.floor(Math.random() * 1000), 59, {from: accounts[i]});
      await doublePriceAuctionInstance.placeBid(Math.floor(Math.random() * 100), {from: accounts[i]});

      await doublePriceAuctionInstance.registerOffer(Math.floor(Math.random() * 1000), 59, {from: accounts[i]});
      await doublePriceAuctionInstance.placeOffer(Math.floor(Math.random() * 100), {from: accounts[i]});
    });
    
    it(`should calc mcp for ${i} bidder and offer`, async () => {
      const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
      let spend = new Date();
      let tx = await doublePriceAuctionInstance.mcp();
      let spend_time = new Date().getTime() - spend.getTime()
      let aux = (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
      fs.appendFile('mcp.csv', aux, err => {
        if (err) {
          console.error(err)
        }
      });
    });
  }
});