const DoublePriceAuctionContract = artifacts.require("DoublePriceAuctionContract");
const IterableMapping = artifacts.require("IterableMapping");

module.exports = function(deployer) {
  deployer.deploy(IterableMapping);
  deployer.link(IterableMapping, DoublePriceAuctionContract);
  deployer.deploy(DoublePriceAuctionContract, 1000, 'Energy Token', 0, 'ET');
};