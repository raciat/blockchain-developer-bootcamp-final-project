const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const PreciousStoneToken = artifacts.require('./PreciousStoneToken.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(PreciousStoneToken);
}
