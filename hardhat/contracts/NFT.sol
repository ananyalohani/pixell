pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PixellNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  event NFTBought(address _seller, address _buyer, uint256 _price);

  mapping (uint256 => uint256) public tokenIdToPrice;

  // keep track of total NFTs minted and assign unique IDs
  Counters.Counter private _tokenIds;

  constructor() public ERC721("PixellNFT", "NFT") {}

  function mintNFT(address recipient, string memory tokenURI)
    public
    returns (uint256)
  {
    // call this function to mint a pixel art NFT
    _tokenIds.increment();

    uint256 newTokenId = _tokenIds.current(); // new tokenId for the NFT to be minted
    _mint(recipient, newTokenId);
    _setTokenURI(newTokenId, tokenURI); // assigns a tokenId to the tokenURI

    return newTokenId; // returns the tokenId of the NFT
  }

  function allowBuy(uint256 _tokenId, uint256 _price)
    external
  {
    // call this function to place the NFT on sale in the marketplace
    require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
    require(_price > 0, 'Price cannot be 0');
    tokenIdToPrice[_tokenId] = _price;
  }

  function disallowBuy(uint256 _tokenId)
    external
  {
    // call this function to remove the NFT from the marketplace (after it is bought)
    // need to pass the tokenId of the NFT in the buyer's wallet NOT SENDER
    require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
    tokenIdToPrice[_tokenId] = 0;
  }

  function buyNFT(uint256 _tokenId)
    external payable
  {
    // call this function to buy an NFT
    uint256 price = tokenIdToPrice[_tokenId];
    require(price > 0, 'This token is not for sale');
    require(msg.value == price, 'Incorrect value');

    address seller = ownerOf(_tokenId);
    require(msg.sender != seller, 'You already own this token');

    _transfer(seller, msg.sender, _tokenId); // transfer ownership of token from seller to buyer
    tokenIdToPrice[_tokenId] = 0; // remove from sale
    payable(seller).transfer(msg.value); // transfer ETH to seller

    emit NFTBought(seller, msg.sender, msg.value);
  }
}
