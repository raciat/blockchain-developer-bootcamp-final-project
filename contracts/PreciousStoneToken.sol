// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

/// @title Precious Stones Mint via PST - Precious Stone Non-Fungible Tokens
/// @author Tomasz Racia
/// @notice It is a market of precious stones based on NFTs
/// @dev Based on predefined contracts and extensions with custom logic for precious stones market
/// @custom:experimental This is an experimental contract
contract PreciousStoneToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  AggregatorV3Interface internal priceFeed;

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
    uint priceUsd; // Price in USD
    uint priceWei; // Price in wei
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

  modifier paidEnough(uint priceWei) {
    require(msg.value >= priceWei, 'Not paid enough');
    _;
  }

  // Calculate price in wei based on ETH/USD
  modifier getWeiPrice(uint sku) {
    (int ethToUsdPrice, uint8 ethToUsdDecimals) = getLatestPrice();
    uint priceInWei = _getPriceInWei(ethToUsdPrice, ethToUsdDecimals, items[sku].priceUsd);
    items[sku].priceWei = priceInWei;
    _;
  }

  modifier checkValue(uint sku) {
    // Refund them after pay for item
    _;

    uint amountToRefund = msg.value - items[sku].priceWei;
    items[sku].buyer.transfer(amountToRefund);
  }

  constructor(address priceFeedAddress) ERC721('PreciousStoneToken', 'PST') {
    admins[msg.sender] = true;

    /**
     * Aggregator: ETH / USD
     * List of addresses: https://docs.chain.link/docs/ethereum-addresses/
     */
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  function getLatestPrice() public view returns (int, uint8) {
    (, int price, , ,) = priceFeed.latestRoundData();
    uint8 decimals = priceFeed.decimals();

    return (price, decimals);
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

  function addItem(string memory ipfsHash, uint priceUsd) public onlySuppliers returns (bool) {
    items[skuCount] = Item({
      sku: skuCount,
      supplier: suppliers[msg.sender],
      state: State.ForSale,
      priceUsd: priceUsd, // Price in USD
      priceWei: 0, // Price in wei
      ipfsHash: ipfsHash,
      buyer: payable(address(0)),
      tokenId: 0
    });

    emit LogItemForSale(skuCount);

    skuCount += 1;

    return true;
  }

  function _getPriceInWei(int ethToUsdPrice, uint8 ethToUsdDecimals, uint usdPrice) internal pure returns (uint) {
    uint8 precision = 18;
    uint ethToUsdPricePrec = uint(ethToUsdPrice) * 10 ** (precision  - ethToUsdDecimals);
    uint usdPricePrec = usdPrice * 10 ** (precision * 2);

    return usdPricePrec / ethToUsdPricePrec;
  }

  function getAvailableItems() public view returns (Item[] memory) {
    Item[] memory _items = new Item[](skuCount);
    (int ethToUsdPrice, uint8 ethToUsdDecimals) = getLatestPrice();

    for (uint i = 0; i < skuCount; i++) {
      if (items[i].state == State.ForSale && items[i].buyer == payable(address(0)) && items[i].supplier.active == true) {
        _items[i] = items[i];

        // Calculate price in wei based on ETH/USD
        _items[i].priceWei = _getPriceInWei(ethToUsdPrice, ethToUsdDecimals, items[i].priceUsd);
      }
    }

    return _items;
  }

  function buyItem(uint sku) public payable forSale(sku) getWeiPrice(sku) paidEnough(items[sku].priceWei) checkValue(sku) returns (bool) {
    items[sku].supplier.supplierAddress.transfer(items[sku].priceWei);

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
