const DoublePriceAuctionLocation = artifacts.require("DoublePriceAuctionLocation");
const IterableMapping = artifacts.require("IterableMapping");
const Math = artifacts.require("Math");
const Trigonometry = artifacts.require("Trigonometry");
const Spatial = artifacts.require("Spatial");


module.exports = function(deployer) {
  deployer.deploy(Math);
  deployer.deploy(Trigonometry);
  deployer.deploy(Spatial);
  deployer.link(IterableMapping, DoublePriceAuctionLocation);
  deployer.link(Math, DoublePriceAuctionLocation);
  deployer.link(Trigonometry, DoublePriceAuctionLocation);
  deployer.link(Spatial, DoublePriceAuctionLocation);
  deployer.deploy(DoublePriceAuctionLocation, 1000, 'Energy Token', 0, 'ET');
};