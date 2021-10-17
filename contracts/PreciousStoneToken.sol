// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/// @title Precious Stones Mint via PST - Precious Stone Non-Fungible Tokens
/// @author Tomasz Racia
/// @notice It is a market of precious stones based on NFTs
/// @dev Based on predefined contracts and extensions with custom logic for precious stones market
/// @custom:experimental This is an experimental contract
contract PreciousStoneToken is ERC721, ERC721URIStorage, ERC721Burnable {

  mapping (address => bool) public owners;

  modifier onlyOwner() {
    require(owners[msg.sender] == true);
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

  uint public skuCount;

  struct Item {
    uint sku;
    Diamond gem;
    Supplier supplier;
    State state;
    address payable buyer;
    string tokenId;
  }

  mapping (address => Supplier) public suppliers;
  mapping (uint => Item) public items;

  event LogNewSupplier(address supplierAddress);
  event LogSupplierDeactivated(address supplierAddress);
  event LogSupplierActivated(address supplierAddress);

  event LogItemForSale(uint sku);
  event LogItemSold(uint sku);

  modifier onlySuppliers() {
    require(suppliers[msg.sender].active == true);
    _;
  }

  constructor() ERC721("PreciousStoneToken", "PST") {
    owners[msg.sender] = true;
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

  function addItem(Color color, Clarity clarity, string memory cut, uint caratWeight) public onlySuppliers returns (bool) {
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
      buyer: payable(address(0)),
      tokenId: ''
    });

    emit LogItemForSale(skuCount);

    skuCount += 1;

    return true;
  }

  function safeMint(address to, uint256 tokenId) public onlyOwner {
    _safeMint(to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
