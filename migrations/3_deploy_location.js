const DoublePriceAuctionLocation = artifacts.require("DoublePriceAuctionLocation");
const IterableMapping = artifacts.require("IterableMapping");
const Math = artifacts.require("Math");
const SignedMath = artifacts.require("SignedMath");
const Trigonometry = artifacts.require("Trigonometry");


module.exports = function(deployer) {
  deployer.deploy(Math);
  deployer.deploy(SignedMath);
  
  deployer.link(Math, Trigonometry);
  deployer.link(SignedMath, Trigonometry);
  deployer.deploy(Trigonometry);
  
  deployer.link(IterableMapping, DoublePriceAuctionLocation);
  deployer.link(Trigonometry, DoublePriceAuctionLocation);
  deployer.deploy(DoublePriceAuctionLocation, 1000, 'Energy Token', 0, 'ET', 1000);
};