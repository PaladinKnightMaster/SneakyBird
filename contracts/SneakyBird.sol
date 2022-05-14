// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';

contract SneakyBird is ERC721URIStorage, Ownable, VRFConsumerBase {
  mapping(bytes32 => address) public requestIdToSender;
  mapping(uint256 => Material) public tokenIdToMaterial;
  mapping(bytes32 => uint256) public requestIdToTokenId;
  mapping(address => uint256) public walletMints; // Track the quantity of mints on a wallet
  event requestedNFT(bytes32 indexed requestId); // for testing purposes only

  bytes32 internal keyHash; // Created Variables to interact with Chainlink VRF
  uint256 internal fee; // Created Variables to interact with Chainlink VRF
  uint256 public tokenCounter;
  uint256 internal goldToken;
  address payable public withdrawWallet;
  uint256 public mintPrice;
  uint256 public maxSupply;
  uint256 public maxPerWallet;
  bool public isPublicMintEnabled;

  enum Material {
    SILVER,
    GOLD
  }

  constructor(
    address _VRFCoordinator,
    address _LinkToken,
    bytes32 _keyhash
  ) VRFConsumerBase(_VRFCoordinator, _LinkToken) ERC721('Mushrooms', 'MUSH') {
    keyHash = _keyhash;
    fee = 0.1 * 10**18; // 0.1 LINK
    mintPrice = 0.03 ether;
    tokenCounter = 0;
    maxSupply = 925; // Not being used yet
    maxPerWallet = 3; // Not being used yet
    withdrawWallet = payable(msg.sender);
    goldToken = 0;
  }

  // This next function is the main function to create an NFT, once the function is called then...
  // it makes a requestRandomness to Chainlink VRF and the response is a callback to the next function called fulfillRandomness.

  function createNFT(string memory tokenURI, uint256 _quantity) public payable returns (bytes32) {
    require(isPublicMintEnabled, 'Minting is not enabled yet');
    require(msg.value == _quantity * mintPrice, 'Wrong mint Price');
    require(tokenCounter + _quantity <= maxSupply, 'Collection is Sold Out');
    require(walletMints[msg.sender] + _quantity <= maxPerWallet, 'wallet exceeded max of mints');

    for (uint256 i = 0; i < _quantity; i++) {
      bytes32 requestId = requestRandomness(keyHash, fee);
      requestIdToSender[requestId] = msg.sender;
      emit requestedNFT(requestId); // for testing purposes only
      return requestId;
    }
  }

  // Callback function used by the Chainlink VRF Contract to render a random number

  function fulfillRandomness(bytes32 requestId, uint256 randomNumber) internal override {
    address mushroomOwner = requestIdToSender[requestId];
    uint256 newItemId = tokenCounter;
    _safeMint(mushroomOwner, newItemId);
    Material material = Material(randomNumber % 2);
    if (material == Material(1) && goldToken < 6) {
      tokenIdToMaterial[newItemId] = Material(1);
      goldToken + 1;
    } else {
      tokenIdToMaterial[newItemId] = Material(0);
    }
    setTokenURI(newItemId, tokenURI);
    requestIdToTokenId[requestId] = newItemId;
    tokenCounter = tokenCounter + 1;
  }

  function setTokenURI(uint256 tokenId, string _tokenURI) public {
    require(
      _isApprovedOrOwner(_msgSender(), tokenId),
      'ERC721: transfer caller is not owner nor approved'
    );
    _setTokenURI(tokenId, _tokenURI);
  }

  function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner {
    isPublicMintEnabled = _isPublicMintEnabled;
  }

  function withdraw() external onlyOwner {
    (bool success, ) = withdrawWallet.call{value: address(this).balance}('');
    require(success, 'Failed to Withdraw');
  }

  function burn(uint256 tokenId) public {
    _burn(tokenId);
  }
}
