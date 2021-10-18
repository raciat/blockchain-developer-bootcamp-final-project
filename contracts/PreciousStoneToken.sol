// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';

/// @title Precious Stones Mint via PST - Precious Stone Non-Fungible Tokens
/// @author Tomasz Racia
/// @notice It is a market of precious stones based on NFTs
/// @dev Based on predefined contracts and extensions with custom logic for precious stones market
/// @custom:experimental This is an experimental contract
contract PreciousStoneToken is ERC721, ERC721URIStorage, ERC721Burnable {

  mapping (address => bool) internal owners;

  modifier onlyOwner() {
    require(owners[msg.sender] == true, 'Not an owner');
    _;
  }

  event LogOwnerAdded(address additionalOwnerAddress);
  event LogOwnerRemoved(address ownerAddress);

  // All available options as diamond's color
  enum Color { D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z }

  // All available options as diamond's clarity
  enum Clarity { Flawless, InternallyFlawless, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3 }

  struct Diamond {
    Color color;
    Clarity clarity;
    string cut;
    uint caratWeight;
  }

  struct Supplier {
    address payable supplierAddress;
    string supplierName;
    bool active;
  }

  enum State { ForSale, Sold }

  uint internal skuCount;

  struct Item {
    uint sku;
    Diamond gem;
    Supplier supplier;
    State state;
    uint price;
    address payable buyer;
    string tokenId;
  }

  mapping (address => Supplier) internal suppliers;
  mapping (uint => Item) internal items;

  event LogNewSupplier(address supplierAddress);
  event LogSupplierDeactivated(address supplierAddress);
  event LogSupplierActivated(address supplierAddress);

  event LogItemForSale(uint sku);
  event LogItemSold(uint sku);

  modifier onlySuppliers() {
    require(suppliers[msg.sender].active == true, 'Not a supplier');
    _;
  }

  modifier forSale(uint sku) {
    require(items[sku].state == State.ForSale, 'Not for sale');
    require(items[sku].buyer == payable(address(0)), 'Not for sale');
    _;
  }

  modifier paidEnough(uint price) {
    require(msg.value >= price, 'Not paid enough');
    _;
  }

  modifier checkValue(uint sku) {
    // Refund them after pay for item
    _;

    uint price = items[sku].price;
    uint amountToRefund = msg.value - price;
    items[sku].buyer.transfer(amountToRefund);
  }

  constructor() ERC721('PreciousStoneToken', 'PST') {
    owners[msg.sender] = true;
  }

  function isOwner(address ownerAddress) public view returns (bool) {
    return owners[ownerAddress] ? true : false;
  }

  function addOwner(address additionalOwnerAddress) public onlyOwner returns (bool) {
    owners[additionalOwnerAddress] = true;

    emit LogOwnerAdded(additionalOwnerAddress);

    return true;
  }

  function removeOwner(address ownerAddress) public onlyOwner returns (bool) {
    delete owners[ownerAddress];

    emit LogOwnerRemoved(ownerAddress);

    return true;
  }

  function isSupplier(address payable supplierAddress) public view returns (bool) {
    return suppliers[supplierAddress].active ? true : false;
  }

  function addSupplier(address payable supplierAddress, string memory supplierName) public onlyOwner returns (bool) {
    suppliers[supplierAddress] = Supplier({
      supplierAddress: supplierAddress,
      supplierName: supplierName,
      active: true
    });

    emit LogNewSupplier(supplierAddress);

    return true;
  }

  function activateSupplier(address payable supplierAddress) public onlyOwner returns (bool) {
    suppliers[supplierAddress].active = true;

    emit LogSupplierActivated(supplierAddress);

    return true;
  }

  function deactivateSupplier(address payable supplierAddress) public onlyOwner returns (bool) {
    suppliers[supplierAddress].active = false;

    emit LogSupplierDeactivated(supplierAddress);

    return true;
  }

  function addItem(Color color, Clarity clarity, string memory cut, uint caratWeight, uint price) public onlySuppliers returns (bool) {
    Diamond memory gem = Diamond({
      color: color,
      clarity: clarity,
      cut: cut,
      caratWeight: caratWeight
    });

    items[skuCount] = Item({
      sku: skuCount,
      gem: gem,
      supplier: suppliers[msg.sender],
      state: State.ForSale,
      price: price,
      buyer: payable(address(0)),
      tokenId: ''
    });

    emit LogItemForSale(skuCount);

    skuCount += 1;

    return true;
  }

  function getAvailableItems() public view returns (Item[] memory){
    Item[] memory _items = new Item[](skuCount);

    for (uint i = 0; i < skuCount; i++) {
      if (items[i].state == State.ForSale && items[i].buyer == payable(address(0)) && items[i].supplier.active == true) {
        _items[i] = items[i];
      }
    }

    return _items;
  }

  function buyItem(uint sku) public payable forSale(sku) paidEnough(items[sku].price) checkValue(sku) returns (bool) {
    items[sku].supplier.supplierAddress.transfer(items[sku].price);

    items[sku].buyer = payable(msg.sender);
    items[sku].state = State.Sold;

    emit LogItemSold(sku);
    
    return true;
  }

  function safeMint(address to, uint256 tokenId) internal onlyOwner {
    _safeMint(to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
