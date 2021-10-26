const AggregatorV3Mock = artifacts.require('./AggregatorV3Mock.sol');
const PreciousStoneToken = artifacts.require('./PreciousStoneToken.sol');

module.exports = async function(deployer/*, network, accounts */) {
  // Deploy AggregatorV3Mock first
  await deployer.deploy(AggregatorV3Mock);
  const aggregatorV3Mock = await AggregatorV3Mock.deployed();

  // Deploy PreciousStoneToken second using address of AggregatorV3Mock
  await deployer.deploy(PreciousStoneToken, aggregatorV3Mock.address);
}
