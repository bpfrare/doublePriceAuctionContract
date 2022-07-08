const DoublePriceAuctionContract = artifacts.require("doublePriceAuctionContract");

module.exports = function(deployer) {
  deployer.deploy(DoublePriceAuctionContract, 1000, 'Energy Token', 0, 'ET');
};