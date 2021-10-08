const PreciousStoneToken = artifacts.require('./PreciousStoneToken.sol');

module.exports = function(deployer) {
  deployer.deploy(PreciousStoneToken);
}
