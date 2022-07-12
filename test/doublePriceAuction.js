const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");

contract('DoublePriceAuction', (accounts) => {
    it('should register a Bidder', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        const idx = await doublePriceAuctionInstance.registerBid(1,10);
        console.log(idx);
        // assert.equal(idx, 0, 'The index of the first element should be 0');
    });

    it('should register a second Bidder', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        const idx = await doublePriceAuctionInstance.registerBid(1,20);
        // assert.equal(idx, 1, 'The index of the first element should be 1');
    });

});