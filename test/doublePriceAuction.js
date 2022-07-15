const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");

contract('DoublePriceAuction', (accounts) => {
    it('should register a Bidder', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(1,10);
        let idx = await doublePriceAuctionInstance.getBidsSize.call();
        assert.equal(idx, 1, 'The index of the first element should be 0');
    });

    it("shouldn't register same bidder", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(2,20);
        let idx = await doublePriceAuctionInstance.getBidsSize.call();
        assert.equal(idx, 1, 'The index of the first element should be 1');
    });

    it('should register another bidder', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(3,20, {from: accounts[1]});
        let idx = await doublePriceAuctionInstance.getBidsSize.call();
        assert.equal(idx, 2, 'The index of the first element should be 1');
    });

    it('should increment their bid', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.placeBid(50);
        const aux = await doublePriceAuctionInstance.getBids.call();
        assert.equal(aux[0][0], 2, "The value of bid should be 2");
        assert.equal(aux[1][0], 50, "The amount of bid should be 50");

    });

    // it('should register 100 Bidder', async () => {
    //     const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
    //     for(let i=3;i<103;i++) {
    //         await doublePriceAuctionInstance.registerBid(i,i*10);
    //     }
    // });

});