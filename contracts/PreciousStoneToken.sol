// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Precious Stones Mint via PST - Precious Stone Non-Fungible Tokens
/// @author Tomasz Racia
/// @notice It is a market of precious stones based on NFTs
/// @dev Based on predefined contracts and extensions with custom logic for precious stones market
/// @custom:experimental This is an experimental contract
contract PreciousStoneToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {

  // All available options as diamond's color
  enum Color { D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z }

  // All available options as diamond's clarity
  enum Clarity { Flawless, InternallyFlawless, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3 }

  struct Diamond {
    Color color;
    Clarity clarity;
    string cut;
    uint caratWeigh;
  }

  uint public supplierCount;

  struct Supplier {
    address payable supplierAddress;
    string supplierName;
    bool active;
  }

  mapping (uint => Supplier) public suppliers;

  event LogNewSupplier(address supplierAddress);
  event LogSupplierDeactivated(uint supplierCount);
  event LogSupplierActivated(uint supplierCount);

  modifier forSale(uint _sku) {
    require(items[_sku].state == State.ForSale);
    require(items[_sku].buyer == address(0));
    _;
  }

  modifier sold(uint _sku) {
    require(items[_sku].state == State.Sold);
    require(items[_sku].buyer != address(0));
    _;
  }

  constructor() ERC721("PreciousStoneToken", "PST") {}

  function getSuppliers() public view onlyOwner returns (Supplier[] memory){
    Supplier[] memory _suppliers = new Supplier[](supplierCount);
    for (uint i = 0; i < supplierCount; i++) {
      _suppliers[i] = suppliers[i];
    }
    return _suppliers;
  }

  function addSupplier(address payable supplierAddress, string memory supplierName) public onlyOwner returns (bool) {
    suppliers[supplierCount] = Supplier({
    supplierAddress: supplierAddress,
    supplierName: supplierName,
    active: true
    });

    supplierCount += 1;

    emit LogNewSupplier(supplierAddress);

    return true;
  }

  function activateSupplier(uint _supplierCount) public onlyOwner returns (bool) {
    suppliers[_supplierCount].active = true;

    emit LogSupplierActivated(_supplierCount);

    return true;
  }

  function deactivateSupplier(uint _supplierCount) public onlyOwner returns (bool) {
    suppliers[_supplierCount].active = false;

    emit LogSupplierDeactivated(_supplierCount);

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
