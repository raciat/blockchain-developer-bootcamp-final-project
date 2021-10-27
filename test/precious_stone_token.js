const AggregatorV3Mock = artifacts.require('AggregatorV3Mock');
const PreciousStoneToken = artifacts.require('PreciousStoneToken');

const { items: ItemStruct, isDefined, isType } = require('./ast-helper');
const itemsFixture = require('./fixtures/items');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('PreciousStoneToken', async function(accounts) {
  const [contractOwner, additionalAdmin, account3, account4] = accounts;
  const supplierName = 'Supplier 1';
  let instance;

  beforeEach(async () => {
    const aggregatorV3Mock = await AggregatorV3Mock.new();
    const priceFeedMockAddress = aggregatorV3Mock.address;
    instance = await PreciousStoneToken.new(priceFeedMockAddress);
  });

  describe('Enums', () => {
    const enumState = PreciousStoneToken.enums.State;

    describe('State Enum', () => {
      it('should define `State`', () => {
        assert(enumState, 'The contract should define an Enum called `State`');
      });

      it('should have properties', () => {
        assert(enumState.hasOwnProperty('ForSale'), 'The enum does not have a `ForSale` value');
        assert(enumState.hasOwnProperty('Sold'), 'The enum does not have a `Sold` value');
      });
    });
  });

  describe('Structs', () => {
    describe('Item Struct', () => {
      let itemStruct;
  
      before(() => {
        itemStruct = ItemStruct(PreciousStoneToken);
      });
  
      it('should define `Item Struct`', () => {
        assert(itemStruct !== null, 'The contract should define `Item Struct`');
      });

      it('should have a `sku` field', () => {
        assert(isDefined(itemStruct)('sku'), 'Item Struct should have a `sku` field');
        assert(isType(itemStruct)('sku')('uint'), '`sku` should be of type `uint`');
      });
  
      it('should have a `supplier` field', () => {
        assert(isDefined(itemStruct)('supplier'), 'Item Struct should have a `supplier` field');
      });
      
      it('should have a `state` field', () => {
        assert(isDefined(itemStruct)('state'), 'Item Struct should have a `state` field');
      });

      it('should have a `priceUsd` field', () => {
        assert(isDefined(itemStruct)('priceUsd'), 'Item Struct should have a `priceUsd` field');
        assert(isType(itemStruct)('priceUsd')('uint'), '`priceUsd` should be of type `uint`');
      });

      it('should have a `priceWei` field', () => {
        assert(isDefined(itemStruct)('priceWei'), 'Item Struct should have a `priceWei` field');
        assert(isType(itemStruct)('priceWei')('uint'), '`priceWei` should be of type `uint`');
      });

      it('should have a `ipfsHash` field', () => {
        assert(isDefined(itemStruct)('ipfsHash'), 'Item Struct should have a `ipfsHash` field');
        assert(isType(itemStruct)('ipfsHash')('string'), '`ipfsHash` should be of type `string`');
      });

      it('should have a `buyer` field', () => {
        assert(isDefined(itemStruct)('buyer'), 'Item Struct should have a `buyer` field');
      });

      it('should have a `tokenId` field', () => {
        assert(isDefined(itemStruct)('tokenId'), 'Item Struct should have a `tokenId` field');
        assert(isType(itemStruct)('tokenId')('uint'), '`tokenId` should be of type `uint`');
      });
    });
  });

  describe('Price Feed', () => {
    it('should provide latest price', async () => {
      const result = await instance.getLatestPrice();

      assert.equal(result[0], 406772749646, 'Price feed does not return latest price');
      assert.equal(result[1], 8, 'Price feed does not return precision of the latest price');
    });
  });

  describe('Admins', () => {
    it('should have an admin', async () => {
      const result = await instance.isAdmin(contractOwner);

      assert.equal(result.valueOf(), true, 'The contract has no admin');
    });

    it('should confirm account is an admin', async function() {
      await instance.addAdmin(additionalAdmin);
      const result = await instance.isAdmin(additionalAdmin);

      assert.equal(result.valueOf(), true, 'Incorrect admin returned');
    });

    it('should confirm account is not an admin', async function() {
      await instance.removeAdmin(additionalAdmin);
      const result = await instance.isAdmin(additionalAdmin);

      assert.equal(result.valueOf(), false, 'Incorrect admin returned');
    });
    
    it('should add additional admin', async function() {
      const result = await instance.addAdmin(additionalAdmin);
      const logAdditionalAdminAddress = result.logs[0].args.additionalAdminAddress;

      assert.equal(additionalAdmin, logAdditionalAdminAddress, 'LogAdminAdded event with `additionalAdminAddress` property not emitted');
    });
    
    it('should remove an admin', async function() {
      const result = await instance.removeAdmin(additionalAdmin);
      const logAdminAddress = result.logs[0].args.adminAddress;

      assert.equal(additionalAdmin, logAdminAddress, 'LogAdminRemoved event with `adminAddress` property not emitted');
    });
  });

  describe('Suppliers', () => {
    it('should confirm account is a supplier', async function() {
      await instance.addSupplier(account3, supplierName);
      const result = await instance.isSupplier(account3);

      assert.equal(result.valueOf(), true, 'Incorrect supplier returned');
    });
    
    it('should confirm account is not a supplier', async function() {
      await instance.addSupplier(account3, supplierName);
      await instance.deactivateSupplier(account3);
      const result = await instance.isSupplier(account3);

      assert.equal(result.valueOf(), false, 'Incorrect supplier returned');
    });
    
    it('should add a new supplier', async function() {
      const result = await instance.addSupplier(account3, supplierName);
      const logSupplierAddress = result.logs[0].args.supplierAddress;

      assert.equal(account3, logSupplierAddress, 'LogNewSupplier event with `supplierAddress` property not emitted');
    });
    
    it('should deactivate a supplier', async function() {
      const result = await instance.deactivateSupplier(account3);
      const logSupplierAddress = result.logs[0].args.supplierAddress;

      assert.equal(account3, logSupplierAddress, 'LogSupplierDeactivated event with `supplierAddress` property not emitted');
    });
    
    it('should activate a supplier', async function() {
      const result = await instance.activateSupplier(account3);
      const logSupplierAddress = result.logs[0].args.supplierAddress;

      assert.equal(account3, logSupplierAddress, 'LogSupplierActivated event with `supplierAddress` property not emitted');
    });
  });

  describe('Items', () => {
    it('should return list of available items', async function() {
      await instance.addSupplier(account3, supplierName, { from: contractOwner });
      await instance.addItem(itemsFixture[0].ipfsHash, itemsFixture[0].priceUsd, { from: account3 });

      const result = await instance.getAvailableItems();

      assert.equal(result.length, 1, 'Incorrect number of available items returned');
      assert.equal(result[0].ipfsHash, itemsFixture[0].ipfsHash, 'Incorrect IPFS hash returned');
      assert.equal(result[0].priceUsd, itemsFixture[0].priceUsd, 'Incorrect price in USD returned');
      assert.equal(result[0].priceWei, itemsFixture[0].priceWei, 'Incorrect price in wei returned');
    });

    it('should add a new item', async function() {
      await instance.addSupplier(account3, supplierName, { from: contractOwner });

      const result = await instance.addItem(itemsFixture[1].ipfsHash, itemsFixture[1].priceUsd, { from: account3 });
      const logSku = result.logs[0].args.sku;

      assert.equal(0, logSku, 'LogItemForSale event with `skuCount` property not emitted');
    });

    it('should not allow to add a new item for other than supplier', async function() {
      try {
        await instance.addItem(itemsFixture[1].ipfsHash, itemsFixture[1].priceUsd, { from: account3 });
        assert.fail('It was allowed to add a new item without supplier role');
      }
      catch(err) {
        assert.include(err.message, 'Not a supplier', 'The error message should contain: \'Not a supplier\'');
      }
    });

    it('should set an item as sold', async function() {
      await instance.addSupplier(account3, supplierName, { from: contractOwner });
      await instance.addItem(itemsFixture[0].ipfsHash, itemsFixture[0].priceUsd, { from: account3 });

      const skuCount = 0;
      const result = await instance.buyItem(skuCount, { from: account4, value: itemsFixture[0].priceWei });
      const mintTo = result.logs[0].args.to;
      const tokenId = result.logs[0].args.tokenId;
      const logSku = result.logs[1].args.sku;

      assert.equal(account4, mintTo, 'LogItemSold event with `mintTo` property not emitted');
      assert.equal(1, tokenId, 'LogItemSold event with `tokenId` property not emitted');
      assert.equal(skuCount, logSku, 'LogItemSold event with `skuCount` property not emitted');
    });

    it('should not allow to buy an item for less than original price', async function() {
      await instance.addSupplier(account3, supplierName, { from: contractOwner });
      await instance.addItem(itemsFixture[0].ipfsHash, itemsFixture[0].priceUsd, { from: account3 });

      try {
        await instance.buyItem(0, { from: account4, value: 10, gas: 4712388 });
        assert.fail('It was allowed to buy an item for less than original price');
      }
      catch(err) {
        assert.include(err.message, 'Not paid enough', 'The error message should contain: \'Not paid enough\'');
      }
    });

    it('should not allow to buy an item that is not for sale', async function() {
      await instance.addSupplier(account3, supplierName, { from: contractOwner });
      await instance.addItem(itemsFixture[0].ipfsHash, itemsFixture[0].priceUsd, { from: account3 });
      await instance.buyItem(0, { from: account3, value: itemsFixture[0].priceWei });

      try {
        await instance.buyItem(0, { from: account4, value: itemsFixture[0].priceWei });
        assert.fail('It was allowed to buy an item that is not for sale');
      }
      catch(err) {
        assert.include(err.message, 'Not for sale', 'The error message should contain: \'Not for sale\'');
      }
    });

    it('should refund after payment if sent more funds', async function() {
      await instance.addSupplier(account3, supplierName, { from: contractOwner });
      await instance.addItem(itemsFixture[0].ipfsHash, itemsFixture[0].priceUsd, { from: account3 });

      const currentBalance = await web3.eth.getBalance(account3);
      await instance.buyItem(0, { from: account3, value: 10 * 10 ** 18 });
      const refundBalance = await web3.eth.getBalance(account3);

      assert.isOk(currentBalance - refundBalance < 10 * 10 ** 18, 'Refund was not executed after the payment');
    });
  });

  describe('Deployment', () => {
    it('should assert true', async function() {
      await PreciousStoneToken.deployed();
      return assert.isTrue(true);
    });
  });
});
