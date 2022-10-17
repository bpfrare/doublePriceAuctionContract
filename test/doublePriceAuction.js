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

    it("shouldn't find an Offer with diferent sourceType", async () => {
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


        await doublePriceAuctionInstance.processTransaction(accounts[0]);
        let bc0 = await doublePriceAuctionInstance.balanceOf.call(accounts[0]);
        assert.equal(bc0.toNumber(), 990);
        let bc1 = await doublePriceAuctionInstance.balanceOf.call(accounts[1]);
        assert.equal(bc1.toNumber(), 10);

        let bid = await doublePriceAuctionInstance.getBid.call();
        let offer = await doublePriceAuctionInstance.getOffer.call({from: accounts[1]});
        assert.equal(bid.amount, 0);
        assert.equal(offer.amount, 40);
    });

    it("should close a partial deal ", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(1,2);
        await doublePriceAuctionInstance.placeBid(50);
        
        // First offer
        await doublePriceAuctionInstance.registerOffer(1,2, {from: accounts[1]});
        await doublePriceAuctionInstance.placeOffer(30, {from: accounts[1]});

        // call
        await doublePriceAuctionInstance.processTransaction(accounts[0]);

        // Check
        let bc0 = await doublePriceAuctionInstance.balanceOf.call(accounts[0]);
        assert.equal(bc0.toNumber(), 960);
        let bc1 = await doublePriceAuctionInstance.balanceOf.call(accounts[1]);
        assert.equal(bc1.toNumber(), 40);

        let bid = await doublePriceAuctionInstance.getBid.call();
        let offer1 = await doublePriceAuctionInstance.getOffer.call({from: accounts[1]});
        assert.equal(bid.amount, 20);
        assert.equal(offer1.amount, 0);
    
    });

    it("should close a deal with two offer", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        await doublePriceAuctionInstance.registerBid(1,2);
        await doublePriceAuctionInstance.placeBid(50);
        
        // First offer
        await doublePriceAuctionInstance.registerOffer(1,2, {from: accounts[1]});
        await doublePriceAuctionInstance.placeOffer(20, {from: accounts[1]});
        
        // Second offer
        await doublePriceAuctionInstance.registerOffer(1,2, {from: accounts[2]});
        await doublePriceAuctionInstance.placeOffer(30, {from: accounts[2]});

        // call
        await doublePriceAuctionInstance.processTransaction(accounts[0]);
        
        // Check
        let bc0 = await doublePriceAuctionInstance.balanceOf.call(accounts[0]);
        assert.equal(bc0.toNumber(), 910);
        let bc1 = await doublePriceAuctionInstance.balanceOf.call(accounts[1]);
        assert.equal(bc1.toNumber(), 60);
        let bc2 = await doublePriceAuctionInstance.balanceOf.call(accounts[2]);
        assert.equal(bc2.toNumber(), 30);

        let bid = await doublePriceAuctionInstance.getBid.call();
        let offer1 = await doublePriceAuctionInstance.getOffer.call({from: accounts[1]});
        let offer2 = await doublePriceAuctionInstance.getOffer.call({from: accounts[2]});
        assert.equal(bid.amount, 0);
        assert.equal(offer1.amount, 0);
        assert.equal(offer2.amount, 0);
    
    });

    it("should trade with two bidder and one Offer", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        
        // bidder 1
        await doublePriceAuctionInstance.registerBid(1,2);
        await doublePriceAuctionInstance.placeBid(50);

        // bidder 2
        await doublePriceAuctionInstance.registerBid(1,2, {from: accounts[1]});
        await doublePriceAuctionInstance.placeBid(30, {from: accounts[1]});

        doublePriceAuctionInstance.transfer(accounts[1], 30);

        // Offer
        await doublePriceAuctionInstance.registerOffer(1,2, {from: accounts[2]});
        await doublePriceAuctionInstance.placeOffer(80, {from: accounts[2]});

        // call
        // await doublePriceAuctionInstance.processTransaction(accounts[1]);
        await doublePriceAuctionInstance.trade();

        let bid1 = await doublePriceAuctionInstance.getBid.call();
        let bid2 = await doublePriceAuctionInstance.getBid.call({from: accounts[1]});
        let offer1 = await doublePriceAuctionInstance.getOffer.call({from: accounts[2]});

        assert.equal(bid1.amount, 0);
        assert.equal(bid2.amount, 0);
        assert.equal(offer1.amount, 0);

    });

    it("should sort asc", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();

        // bidder 1
        await doublePriceAuctionInstance.registerBid(15,2);

        // bidder 2
        await doublePriceAuctionInstance.registerBid(20,2, {from: accounts[1]});

        // bidder 3
        await doublePriceAuctionInstance.registerBid(10,2, {from: accounts[2]});

        let bids = await doublePriceAuctionInstance.getSortedBids.call();
        
        assert.equal(bids[0].value, 20);
        assert.equal(bids[1].value, 15);
        assert.equal(bids[2].value, 10);
        
    });

    it("should sort desc", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();

        // offer 1
        await doublePriceAuctionInstance.registerOffer(30,2);

        // offer 2
        await doublePriceAuctionInstance.registerOffer(20,2, {from: accounts[1]});

        // offer 3
        await doublePriceAuctionInstance.registerOffer(25,2, {from: accounts[2]});

        let offers = await doublePriceAuctionInstance.getSortedOffer.call();

        assert.equal(offers[0].value, 20);
        assert.equal(offers[1].value, 25);
        assert.equal(offers[2].value, 30);

    });

    it("should calc MCP", async () => {
        /**
            Value | Bid  | Offer
            100   | 1000 |  500
            125   | 910  |  650
            150   | 830  |  770
            175   | 760  |  870
            200   | 700  |  950
            225   | 650  | 1010

            MCP = 157

         */
        const doublePriceAuctionInstance = await DoublePriceAuction.deployed();
        let values = [100, 125, 150, 175, 200, 225];
        let bids = [1000, 910, 830, 760, 700, 650];
        let offer = [500, 650, 770, 870, 950, 1010];
        
        for(let i = 0; i < values.length; i++) {
            // register bids
            await doublePriceAuctionInstance.registerBid(values[i], 2, {from: accounts[i]});
            await doublePriceAuctionInstance.placeBid(bids[i], {from: accounts[i]});

            // register offers
            await doublePriceAuctionInstance.registerOffer(values[i],2, {from: accounts[values.length + i]});
            await doublePriceAuctionInstance.placeOffer(offer[i], {from: accounts[values.length + i]});

        }

        let mcp = await doublePriceAuctionInstance.mcp.call()
        console.log(mcp);
        assert.equal(mcp, 157);
    });
});