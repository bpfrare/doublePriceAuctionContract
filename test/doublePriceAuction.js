const DoublePriceAuction = artifacts.require("DoublePriceAuctionContract");

contract('DoublePriceAuction', (accounts) => {
    it('should register a Bidder', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(1,10);
        let idx = await doublePriceAuctionInstance.getBidsSize.call();
        assert.equal(idx, 1, 'The number of bids should be 1');
    });

    it("shouldn't register same bidder", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(2,20);
        let idx = await doublePriceAuctionInstance.getBidsSize.call();
        assert.equal(idx, 1, 'The number of bids should be 1');
    });

    it('should register another bidder', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(3,20, {from: accounts[1]});
        let idx = await doublePriceAuctionInstance.getBidsSize.call();
        assert.equal(idx, 2, 'The number of bids should be 2');
    });

    it('should increment their bid', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.placeBid(50);
        const aux = await doublePriceAuctionInstance.getBids.call();
        assert.equal(aux[0].value, 2, "The value of bid should be 2");
        assert.equal(aux[0].amount, 50, "The amount of bid should be 50");

    });

    // it('should register 100 Bidder', async () => {
    //     const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
    //     for(let i=3;i<103;i++) {
    //         await doublePriceAuctionInstance.registerBid(i,i*10);
    //     }
    // });

    it('should register an Offer', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerOffer(10,100);
        let idx = await doublePriceAuctionInstance.getOffersSize.call();
        assert.equal(idx, 1, 'The number of offer should be 1');
    });

    it("shouldn't find an Offer", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerOffer(10,100);
        await doublePriceAuctionInstance.placeOffer(50);
        let auxAddr = await doublePriceAuctionInstance.findOffer.call(accounts[0])
        assert.equal(auxAddr, 0x0);
    });

    it("shouldn't find an Offer", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(1,2);
        await doublePriceAuctionInstance.registerOffer(10,100);
        await doublePriceAuctionInstance.placeOffer(50);
        let auxAddr = await doublePriceAuctionInstance.findOffer.call(accounts[0])
        assert.equal(auxAddr, 0x0);
    });

    it("should close a deal", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(1,2);
        await doublePriceAuctionInstance.placeBid(10);
        await doublePriceAuctionInstance.registerOffer(1,2, {from: accounts[1]});
        await doublePriceAuctionInstance.placeOffer(50, {from: accounts[1]});


        await doublePriceAuctionInstance.processDA(accounts[0]);
        let bc0 = await doublePriceAuctionInstance.balanceOf.call(accounts[0]);
        assert.equal(bc0.toNumber(), 990);
        let bc1 = await doublePriceAuctionInstance.balanceOf.call(accounts[1]);
        assert.equal(bc1.toNumber(), 10);

        let bid = await doublePriceAuctionInstance.getBid.call();
        let offer = await doublePriceAuctionInstance.getOffer.call({from: accounts[1]});
        assert.equal(bid.amount, 0);
        assert.equal(offer.amount, 40);
    });

});