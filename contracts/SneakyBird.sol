// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract SneakyBird is ERC721, Ownable, ERC721Burnable, VRFConsumerBase {
    mapping(bytes32 => address) public requestIdToSender;
    mapping(bytes32 => string) public requestIdToTokenURI;
    mapping(uint256 => Material) public tokenIdToMaterial;
    mapping(bytes32 => uint256) public requestIdToTokenId;
    // event requestedNFT(bytes32 indexed requestId); // for testing purposes only

    bytes32 internal keyHash; // Created Variables to interact with Chainlink VRF
    uint256 internal fee; // Created Variables to interact with Chainlink VRF
    uint256 public tokenCounter;
    address payable public withdrawWallet;
    uint256 public mintPrice;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    bool public isPublicMintEnabled;

    enum Material {
        SILVER,
        GOLD
    }

    constructor()
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B,
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709
        )
        ERC721("Mushrooms", "MUSH")
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18; // 0.1 LINK
        mintPrice = 0.03 ether;
        tokenCounter = 0;
        maxSupply = 925; // Not being used yet
        maxPerWallet = 3; // Not being used yet
    }

    // This next function is the main function to create an NFT, once the function is called then...
    // it makes a requestRandomness to Chainlink VRF and the response is a callback to the next function called fulfillRandomness.

    function createNFT(string memory tokenURI) public returns (bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - Fill the NFT contract with that LINK Coin"
        );
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestIdToSender[requestId] = msg.sender;
        requestIdToTokenURI[requestId] = tokenURI;
        // emit requestedNFT(requestId); // for testing purposes only
    }

    // Callback function used by the Chainlink VRF Contract to render a random number

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        address mushroomOwner = requestIdToSender[requestId];
        string memory tokenURI = requestIdToTokenURI[requestId];
        uint256 newItemId = tokenCounter;
        _safeMint(mushroomOwner, newItemId);
        setTokenURI(newItemId, tokenURI);
        Material material = Material(randomNumber % 2);
        // Here's where I need to create a counter for GOLD NFTs, we can only mint 6 Gold units for the 925 supply
        // Or maybe create a separate MINT Function with logic included
        tokenIdToMaterial[newItemId] = material;
        requestIdToTokenId[requestId] = newItemId;
        tokenCounter = tokenCounter + 1;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        setTokenURI(tokenId, _tokenURI);
    }

    function setIsPublicMintEnabled(bool _isPublicMintEnabled)
        external
        onlyOwner
    {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{value: address(this).balance}(
            ""
        );
        require(success, "Failed to Withdraw");
    }
}
