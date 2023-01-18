const DoublePriceAuctionLocation = artifacts.require("DoublePriceAuctionLocation");
const fs = require('fs')

contract('DoublePriceAuction', (accounts) => {

    it('should register Bidder and update', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuctionLocation.deployed();
        let aux = ''
        let tx = await doublePriceAuctionInstance.registerBid(1, 1);
        
        for(let i=0;i<100;i++) {
          let spend = new Date();
          tx = await doublePriceAuctionInstance.placeBid(i);
          let spend_time = new Date().getTime() - spend.getTime()
          console.log(i, tx.receipt.gasUsed);
          aux += (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';  
        }
        fs.writeFile('results/location/placeBid.csv', aux, err => {
            if (err) {
              console.error(err)
              return
            }
          });
    }); 
});