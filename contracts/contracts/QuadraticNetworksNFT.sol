// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QuadraticNetworksNFT is ERC721, ERC721Enumerable, Ownable {

    mapping(address => address) public _nominations;
    uint256 public _ownerCount;
    uint256 private _totalCount;
    uint256 public _maxNetworkSize;

    constructor(
        string memory name,
        string memory symbol,
        address[] memory initialOwners,
        uint256 maxNetworkSize
    ) ERC721(name, symbol) {
        // Mint NFTs to initial owners without duplicates
        _mintWithoutDuplicates(initialOwners);
        _maxNetworkSize = maxNetworkSize;
    }

    function _mintWithoutDuplicates(address[] memory initialOwners) internal {
        uint256 initialOwnersLength = initialOwners.length;
        bool[] memory addressMinted = new bool[](initialOwnersLength);

        // Iterate through the initialOwners array
        for (uint256 i = 0; i < initialOwnersLength; i++) {
            // Skip duplicates
            if (addressMinted[i]) {
                continue;
            }

            // Mark address as minted
            addressMinted[i] = true;

            // Mint NFT
            _safeMintWithoutDuplicates(initialOwners[i], _totalCount + 1);

            // Check for additional occurrences and mark them as minted
            for (uint256 j = i + 1; j < initialOwnersLength; j++) {
                if (initialOwners[i] == initialOwners[j]) {
                    addressMinted[j] = true;
                }
            }
        }

        // Clean up memory
        delete addressMinted;
    }

    function _safeMintWithoutDuplicates(address to, uint256 tokenId) internal {
        require(balanceOf(to) <= 0, "You can only mint 1 NFT.");

        super._safeMint(to, tokenId);
        // Increment _ownerCount and _totalCount
        _ownerCount += 1;
        _totalCount += 1;
    }

    function _addNomination(address nominee) internal {
        // Check if the network size exceeds the maximum
        require(_maxNetworkSize == 0 || _ownerCount >= _maxNetworkSize, "Network size exceeds the maximum allowed.");
        // check if nominating user posesses the nft
        require(balanceOf(msg.sender) > 0, "You must hold an NFT to nominate.");
        // add nomination to records
        _nominations[msg.sender] = nominee;
    }

    function _removeNomination() internal {
        // check if nominating user posesses the nft
        require(balanceOf(msg.sender) > 0, "You must hold an NFT to nominate.");
        // remove nomination from records
        _nominations[msg.sender] = address(0);
    }

    function nominate(address nominee) external {
        _addNomination(nominee);
    }

    function mint() external {
        // Check minting permission using checkMintPermission and revert if unsuccessful
        require(checkMintPermission(msg.sender), "You aren't permitted to mint.");

        // Mint NFT using _safeMint
        _safeMintWithoutDuplicates(msg.sender, _totalCount + 1);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the token can burn it.");
        // has to be called first because it 
        _removeNomination();
        
        _burn(tokenId);

        // decrement _ownerCount
        _ownerCount -= 1;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal {
        require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    }

    // function _approve(address to, uint256 tokenId) internal override {
    //     require(ownerOf(tokenId) == owner(), "All NFTs in this collection are soulbound and can only be approved by the owner.");
    //     super._approve(to, tokenId);
    // }

    function setMaxNetworkSize(uint256 maxNetworkSize) external onlyOwner {
        require(maxNetworkSize >= _totalCount, "New maximum network size must be greater than or equal to the current network size.");
        _maxNetworkSize = maxNetworkSize;
    }

    function getOwnedNFTs(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);

        if (tokenCount == 0) {
            // No tokens owned by the address
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);

            for (uint256 i = 0; i < _totalCount; i++) {
                result[i] = tokenOfOwnerByIndex(owner, i);
            }

            return result;
        }
    }

    function checkMintPermission(address nominee) public view returns (bool) {
        // Check if the user already has the NFT
        if (balanceOf(nominee) > 0) {
            return false;
        }

        // Check if _maxNetworkSize is reached
        if (_maxNetworkSize > 0 && _ownerCount >= _maxNetworkSize) {
            return false;
        }

        // Calculate the square root of _ownerCount rounded up
        uint256 squareRoot = sqrt(_ownerCount);

        // Get the count of nominations for the user
        uint256 nominationCount = 0;
        for (uint256 i = 0; i < _totalCount; i++) {
            if (_nominations[ownerOf(i)] == nominee) {
                nominationCount++;
            }
        }

        // Check if the count of nominations is greater than or equal to the square root of _ownerCount
        if (nominationCount >= squareRoot) {
            return false;
        }

        return true;
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        if (x == 1) return 1;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
