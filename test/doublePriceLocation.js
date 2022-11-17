const DoublePriceAuctionLocation = artifacts.require("DoublePriceAuctionLocation");

//Unifesp -23.163217, -45.794390

//Fatec: -23.162580, -45.794539

contract('DoublePriceAuction', (accounts) => {
    it('should register the location', async () => {
        const doublePriceAuctionInstance = await DoublePriceAuctionLocation.deployed();
        await doublePriceAuctionInstance.setLocation(-23163217000, -45794390000);
        let loc = await doublePriceAuctionInstance.getLocation.call();
        assert.equal(loc.lat, -23163217000, 'The latitude should be -23163217');
        assert.equal(loc.lng, -45794390000, 'The longitude should be -45794390');
    });

    it("should calculate the distance", async () => {
        const doublePriceAuctionInstance = await DoublePriceAuctionLocation.deployed();
        await doublePriceAuctionInstance.setLocation(-23163217000, -45794390000);
        await doublePriceAuctionInstance.setLocation(-23162580000, -45794539000, {from: accounts[1]});
        let dist = await doublePriceAuctionInstance.calcDistance.call(accounts[0], accounts[1]);
        assert.equal(dist.toNumber(), 654194, 'The should be 654194');
    });
});