// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title Precious Stones Mint via PST - Precious Stone Non-Fungible Tokens
/// @author Tomasz Racia
/// @notice It is a market of precious stones based on NFTs
/// @dev Based on predefined contracts and extensions with custom logic for precious stones market
/// @custom:experimental This is an experimental contract
contract PreciousStoneToken is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping (address => bool) internal owners;

  modifier onlyOwner() {
    require(owners[msg.sender] == true, 'Not an owner');
    _;
  }

  event LogOwnerAdded(address additionalOwnerAddress);
  event LogOwnerRemoved(address ownerAddress);

  struct Supplier {
    address payable supplierAddress;
    string supplierName;
    bool active;
  }

  enum State { ForSale, Sold }

  uint internal skuCount;

  struct Item {
    uint sku;
    Supplier supplier;
    State state;
    uint price;
    string ipfsHash;
    address payable buyer;
    uint tokenId;
  }

  mapping (address => Supplier) internal suppliers;
  mapping (uint => Item) internal items;

  event LogNewSupplier(address supplierAddress);
  event LogSupplierDeactivated(address supplierAddress);
  event LogSupplierActivated(address supplierAddress);

  event LogItemForSale(uint sku, uint tokenId);
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

  function addItem(string memory ipfsHash, uint price) public onlySuppliers returns (bool) {
    items[skuCount] = Item({
      sku: skuCount,
      supplier: suppliers[msg.sender],
      state: State.ForSale,
      price: price,
      ipfsHash: ipfsHash,
      buyer: payable(address(0)),
      tokenId: 0
    });

    uint tokenId = mintItem(msg.sender, ipfsHash);
    items[skuCount].tokenId = tokenId;

    emit LogItemForSale(skuCount, tokenId);

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

  function _baseURI() internal pure override returns (string memory) {
    return 'https://ipfs.io/ipfs/';
  }

  function mintItem(address to, string memory tokenURI) public onlySuppliers returns (uint) {
    _tokenIds.increment();
    uint256 id = _tokenIds.current();

    _mint(to, id);
    _setTokenURI(id, tokenURI);

    return id;
  }
}
