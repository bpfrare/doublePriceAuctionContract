const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");
const fs = require('fs')

contract('DoublePriceAuction', (accounts) => {

    it('should register 100 Bidder', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        let aux = ''
        for(let i=0;i<100;i++) {
            let spend = new Date();
            let tx = await doublePriceAuctionInstance.registerBid(i+1, (i+1), {from: accounts[i]});
            let spend_time = new Date().getTime() - spend.getTime()
            console.log(i, tx.receipt.gasUsed);
            aux += (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
        }
        fs.writeFile('registerBidders.csv', aux, err => {
            if (err) {
              console.error(err)
              return
            }
          });
    }); 
});