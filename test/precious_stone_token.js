const PreciousStoneToken = artifacts.require('PreciousStoneToken');

const { items: DiamondStruct, isDefined, isType } = require('./ast-helper');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('PreciousStoneToken', function (accounts) {
  const [contractOwner, additionalOwner, account3, account4] = accounts;
  let instance;

  beforeEach(async () => {
    instance = await PreciousStoneToken.new();
  });

  describe('Enums', () => {
    const enumColor = PreciousStoneToken.enums.Color;
    const enumClarity = PreciousStoneToken.enums.Clarity;

    describe('Color Enum', () => {
      it('should define `Color`', () => {
        assert(enumColor, 'The contract should define an Enum called `Color`');
      });
    });
    
    describe('Clarity Enum', () => {
      it('should define `Clarity`', () => {
        assert(enumClarity, 'The contract should define an Enum called `Clarity`');
      });

      it('should has properties', () => {
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
    describe('Diamond Struct', () => {
      let diamondStruct;
  
      before(() => {
        diamondStruct = DiamondStruct(PreciousStoneToken);
      });
  
      it('should define `Diamond Struct`', () => {
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
      
      it('should have a `caratWeight`', () => {
        assert(isDefined(diamondStruct)('caratWeight'), 'Diamond Item should have a `caratWeight` field');
        assert(isType(diamondStruct)('caratWeight')('uint'), '`caratWeight` should be of type `uint`');
      });
    });
  });

  describe('Owners', () => {
    it('should have an owner', async () => {
      assert.equal(await instance.owners.call(contractOwner), true, 'the contract has no owner');
    });
    
    it('should add additional owner', async function () {
      const result = await instance.addOwner(additionalOwner);
      const logAdditionalOwnerAddress = result.logs[0].args.additionalOwnerAddress;

      assert.equal(additionalOwner, logAdditionalOwnerAddress, 'LogOwnerAdded event with `additionalOwnerAddress` property not emitted');
    });
    
    it('should remove an owner', async function () {
      const result = await instance.removeOwner(additionalOwner);
      const logOwnerAddress = result.logs[0].args.ownerAddress;

      assert.equal(additionalOwner, logOwnerAddress, 'LogOwnerRemoved event with `ownerAddress` property not emitted');
    });
  });

  describe('Suppliers', () => {
    it('should add a new supplier', async function () {
      const result = await instance.addSupplier(account3, 'Supplier 1');
      const logSupplierAddress = result.logs[0].args.supplierAddress;

      assert.equal(account3, logSupplierAddress, 'LogNewSupplier event with `supplierAddress` property not emitted');
    });
    
    it('should deactivate a supplier', async function () {
      const result = await instance.deactivateSupplier(account3);
      const logSupplierAddress = result.logs[0].args.supplierAddress;

      assert.equal(account3, logSupplierAddress, 'LogSupplierDeactivated event with `supplierAddress` property not emitted');
    });
    
    it('should activate a supplier', async function () {
      const result = await instance.activateSupplier(account3);
      const logSupplierAddress = result.logs[0].args.supplierAddress;

      assert.equal(account3, logSupplierAddress, 'LogSupplierActivated event with `supplierAddress` property not emitted');
    });
  });

  describe('Items', () => {
    it('should add a new item', async function () {
      await instance.addSupplier(account3, 'Supplier 1', { from: contractOwner });
      
      const result = await instance.addItem(0, 0, 'diamond', 2, 10000, { from: account3 });
      const logSku = result.logs[0].args.sku;

      assert.equal(0, logSku, 'LogItemForSale event with `skuCount` property not emitted');
    });

    it('should set an item as sold', async function () {
      const skuCount = 0;
      const result = await instance.buyItem(skuCount, { from: account4 });
      const logSku = result.logs[0].args.sku;

      assert.equal(skuCount, logSku, 'LogItemSold event with `skuCount` property not emitted');
    });
  });

  describe('Deployment', () => {
    it('should assert true', async function () {
      await PreciousStoneToken.deployed();
      return assert.isTrue(true);
    });
  });
});
