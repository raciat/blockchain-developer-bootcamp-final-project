const PreciousStoneToken = artifacts.require('PreciousStoneToken');

const { items: DiamondStruct, isDefined, isType } = require('./ast-helper');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('PreciousStoneToken', function (/* accounts */) {
  let instance;

  beforeEach(async () => {
    instance = await PreciousStoneToken.new();
  });

  describe('Variables', () => {
    it('should have an owner', async () => {
      assert.equal(typeof instance.owner, 'function', 'the contract has no owner');
    });
  });

  describe('Enums', () => {
    const enumColor = PreciousStoneToken.enums.Color;
    const enumClarity = PreciousStoneToken.enums.Clarity;

    describe('Color Enum', () => {
      assert(enumColor, 'The contract should define an Enum called `Color`');
    });
    
    describe('Color Enum', () => {
      assert(enumClarity, 'The contract should define an Enum called `Clarity`');

      it('should define `ForSale`', () => {
        assert(enumClarity.hasOwnProperty('Flawless'), 'The enum does not have a `Flawless` value');
        assert(enumClarity.hasOwnProperty('InternallyFlawless'), 'The enum does not have a `InternallyFlawless` value');
        assert(enumClarity.hasOwnProperty('VVS1'), 'The enum does not have a `VVS1` value');
        assert(enumClarity.hasOwnProperty('VVS2'), 'The enum does not have a `VVS2` value');
        assert(enumClarity.hasOwnProperty('VS1'), 'The enum does not have a `VS1` value');
        assert(enumClarity.hasOwnProperty('VS2'), 'The enum does not have a `VS2` value');
        assert(enumClarity.hasOwnProperty('SI1'), 'The enum does not have a `SI1` value');
        assert(enumClarity.hasOwnProperty('SI2'), 'The enum does not have a `SI2` value');
        assert(enumClarity.hasOwnProperty('I1'), 'The enum does not have a `I1` value');
        assert(enumClarity.hasOwnProperty('I2'), 'The enum does not have a `I2` value');
        assert(enumClarity.hasOwnProperty('I3'), 'The enum does not have a `I3` value');
      });
    });
  });

  describe('Structs', () => {
    let diamondStruct;

    before(() => {
      diamondStruct = DiamondStruct(PreciousStoneToken);
      assert(diamondStruct !== null, 'The contract should define `Diamond Struct`');
    });

    it('should have a `color`', () => {
      assert(isDefined(diamondStruct)('color'), 'Diamond Item should have a `color` field');
    });

    it('should have a `clarity`', () => {
      assert(isDefined(diamondStruct)('clarity'), 'Diamond Item should have a `clarity` field');
    });

    it('should have a `cut`', () => {
      assert(isDefined(diamondStruct)('cut'), 'Diamond Item should have a `cut` field');
      assert(isType(diamondStruct)('cut')('string'), '`cut` should be of type `string`');
    });
    
    it('should have a `caratWeigh`', () => {
      assert(isDefined(diamondStruct)('caratWeigh'), 'Diamond Item should have a `caratWeigh` field');
      assert(isType(diamondStruct)('caratWeigh')('uint'), '`caratWeigh` should be of type `uint`');
    });
  });

  describe('Suppliers', () => {
    it('should list empty list of suppliers', async function () {
      const suppliers = await instance.getSuppliers();
      assert(suppliers.length, 0, 'List of suppliers should be empty on start');
    });
    
    it('should add a new supplier', async function () {
      await instance.addSupplier('0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb', 'Supplier 1');
      const suppliers = await instance.getSuppliers();
      assert(suppliers.length, 1, 'List of suppliers should be higher by 1');
    });
    
    it('should deactivate a supplier', async function () {
      await instance.deactivateSupplier(0);
      assert.equal(suppliers[0].active, false, 'Supplier should be deactivated');
    });
    
    it('should activate a supplier', async function () {
      await instance.activateSupplier(0);
      assert.equal(suppliers[0].active, true, 'Supplier should be activated');
    });
  });

  describe('Deployment', () => {
    it('should assert true', async function () {
      await PreciousStoneToken.deployed();
      return assert.isTrue(true);
    });
  });
});
