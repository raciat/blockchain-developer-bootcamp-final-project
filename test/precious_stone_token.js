const PreciousStoneToken = artifacts.require('PreciousStoneToken');

const { items: ItemStruct, isDefined, isType } = require('./ast-helper');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('PreciousStoneToken', function (accounts) {
  const [contractOwner, additionalAdmin, account3, account4] = accounts;
  let instance;

  beforeEach(async () => {
    instance = await PreciousStoneToken.new();
  });

  describe('Enums', () => {
    const enumState = PreciousStoneToken.enums.State;

    describe('State Enum', () => {
      it('should define `State`', () => {
        assert(enumState, 'The contract should define an Enum called `State`');
      });

      it('should has properties', () => {
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

      it('should have a `sku`', () => {
        assert(isDefined(itemStruct)('sku'), 'Item Struct should have a `sku` field');
        assert(isType(itemStruct)('sku')('uint'), '`sku` should be of type `uint`');
      });
  
      it('should have a `supplier`', () => {
        assert(isDefined(itemStruct)('supplier'), 'Item Struct should have a `supplier` field');
      });
      
      it('should have a `state`', () => {
        assert(isDefined(itemStruct)('state'), 'Item Struct should have a `state` field');
      });

      it('should have a `priceUsd`', () => {
        assert(isDefined(itemStruct)('priceUsd'), 'Item Struct should have a `priceUsd` field');
        assert(isType(itemStruct)('priceUsd')('uint'), '`priceUsd` should be of type `uint`');
      });

      it('should have a `priceWei`', () => {
        assert(isDefined(itemStruct)('priceWei'), 'Item Struct should have a `priceWei` field');
        assert(isType(itemStruct)('priceWei')('uint'), '`priceWei` should be of type `uint`');
      });

      it('should have a `ipfsHash`', () => {
        assert(isDefined(itemStruct)('ipfsHash'), 'Item Struct should have a `ipfsHash` field');
        assert(isType(itemStruct)('ipfsHash')('string'), '`ipfsHash` should be of type `string`');
      });

      it('should have a `buyer`', () => {
        assert(isDefined(itemStruct)('buyer'), 'Item Struct should have a `buyer` field');
      });

      it('should have a `tokenId`', () => {
        assert(isDefined(itemStruct)('tokenId'), 'Item Struct should have a `tokenId` field');
        assert(isType(itemStruct)('tokenId')('uint'), '`tokenId` should be of type `uint`');
      });
    });
  });

  describe('Admins', () => {
    it('should have an admin', async () => {
      const result = await instance.isAdmin(contractOwner);

      assert.equal(result.valueOf(), true, 'The contract has no admin');
    });

    it('should confirm account is an admin', async function () {
      await instance.addAdmin(additionalAdmin);
      const result = await instance.isAdmin(additionalAdmin);

      assert.equal(result.valueOf(), true, 'Incorrect admin returned');
    });

    it('should confirm account is not an admin', async function () {
      await instance.removeAdmin(additionalAdmin);
      const result = await instance.isAdmin(additionalAdmin);

      assert.equal(result.valueOf(), false, 'Incorrect admin returned');
    });
    
    it('should add additional admin', async function () {
      const result = await instance.addAdmin(additionalAdmin);
      const logAdditionalAdminAddress = result.logs[0].args.additionalAdminAddress;

      assert.equal(additionalAdmin, logAdditionalAdminAddress, 'LogAdminAdded event with `additionalAdminAddress` property not emitted');
    });
    
    it('should remove an admin', async function () {
      const result = await instance.removeAdmin(additionalAdmin);
      const logAdminAddress = result.logs[0].args.adminAddress;

      assert.equal(additionalAdmin, logAdminAddress, 'LogAdminRemoved event with `adminAddress` property not emitted');
    });
  });

  describe('Suppliers', () => {
    it('should confirm account is a supplier', async function () {
      await instance.addSupplier(account3, 'Supplier 1');
      const result = await instance.isSupplier(account3);

      assert.equal(result.valueOf(), true, 'Incorrect supplier returned');
    });
    
    it('should confirm account is not a supplier', async function () {
      await instance.addSupplier(account3, 'Supplier 1');
      await instance.deactivateSupplier(account3);
      const result = await instance.isSupplier(account3);

      assert.equal(result.valueOf(), false, 'Incorrect supplier returned');
    });
    
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
      
      const result = await instance.addItem('QmefEpzFfm3xGKzPn9zsnW8Mkgp7rbvPqvoXw3NFEBPU9f', 10000, { from: account3 });
      const logSku = result.logs[0].args.sku;

      assert.equal(0, logSku, 'LogItemForSale event with `skuCount` property not emitted');
    });

    it('should set an item as sold', async function () {
      const skuCount = 0;
      const result = await instance.buyItem(skuCount, { from: account4 });
      const mintTo = result.logs[0].args.to;
      const tokenId = result.logs[0].args.tokenId;
      const logSku = result.logs[1].args.sku;

      assert.equal(account4, mintTo, 'LogItemSold event with `mintTo` property not emitted');
      assert.equal(1, tokenId, 'LogItemSold event with `tokenId` property not emitted');
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
