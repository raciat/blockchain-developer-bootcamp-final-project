// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
/// @title Precious Stones Mint via PST - Precious Stone Non-Fungible Tokens
/// @author Tomasz Racia
/// @notice It is a market of precious stones based on NFTs
/// @dev Based on predefined contracts and extensions with custom logic for precious stones market
/// @custom:experimental This is an experimental contract
contract PreciousStoneToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping (address => bool) internal admins;

  modifier onlyAdmins {
    require(admins[msg.sender] == true, 'Not an admin');
    _;
  }

  event LogAdminAdded(address additionalAdminAddress);
  event LogAdminRemoved(address adminAddress);

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

  event LogItemForSale(uint sku);
  event LogItemSold(uint sku, uint tokenId);

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
    admins[msg.sender] = true;
  }

  function isAdmin(address adminAddress) public view returns (bool) {
    return admins[adminAddress] ? true : false;
  }

  function addAdmin(address additionalAdminAddress) public onlyAdmins returns (bool) {
    admins[additionalAdminAddress] = true;

    emit LogAdminAdded(additionalAdminAddress);

    return true;
  }

  function removeAdmin(address adminAddress) public onlyAdmins returns (bool) {
    delete admins[adminAddress];

    emit LogAdminRemoved(adminAddress);

    return true;
  }

  function isSupplier(address payable supplierAddress) public view returns (bool) {
    return suppliers[supplierAddress].active ? true : false;
  }

  function addSupplier(address payable supplierAddress, string memory supplierName) public onlyAdmins returns (bool) {
    suppliers[supplierAddress] = Supplier({
      supplierAddress: supplierAddress,
      supplierName: supplierName,
      active: true
    });

    emit LogNewSupplier(supplierAddress);

    return true;
  }

  function activateSupplier(address payable supplierAddress) public onlyAdmins returns (bool) {
    suppliers[supplierAddress].active = true;

    emit LogSupplierActivated(supplierAddress);

    return true;
  }

  function deactivateSupplier(address payable supplierAddress) public onlyAdmins returns (bool) {
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

    uint tokenId = mintItem(msg.sender, items[sku].ipfsHash);
    items[sku].tokenId = tokenId;

    items[sku].buyer = payable(msg.sender);
    items[sku].state = State.Sold;

    emit LogItemSold(sku, tokenId);
    
    return true;
  }

  function _baseURI() internal pure override returns (string memory) {
    return 'https://ipfs.io/ipfs/';
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function mintItem(address to, string memory _tokenURI) internal returns (uint) {
    _tokenIds.increment();
    uint256 id = _tokenIds.current();

    _mint(to, id);
    _setTokenURI(id, _tokenURI);

    return id;
  }
}
