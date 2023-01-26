const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");
const truffleAssert = require('truffle-assertions');
const fs = require('fs');

contract('DoublePriceAuction', (accounts) => {

    it('should register 100 Offer', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        let aux = ''
        await doublePriceAuctionInstance.registerBid(100, 59);
        await doublePriceAuctionInstance.placeBid(10);
        for(let i=0;i<100;i++) {
            await doublePriceAuctionInstance.registerOffer(i+1, i, {from: accounts[i]});
            console.log(i);
            let spend = new Date();
            let tx = await doublePriceAuctionInstance.findOffer(accounts[0]);
            let spend_time = new Date().getTime() - spend.getTime()
            aux += (i+1).toString() + ';' + spend_time.toString() + ';' + tx.receipt.gasUsed.toString() + '\r\n';
        }
        fs.writeFile('findOffer.csv', aux, err => {
            if (err) {
              console.error(err)
              return
            }
          });
    });
    
});