// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable{
    IERC20 public token;

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    receive() external payable {
    }

    function depositToken(uint ethAmount, uint tokenAmount, address seller) external onlyOwner {
        require(
            address(this).balance >= ethAmount,
            "Not enough ether in the reserve"
        );
        token.transferFrom(msg.sender, address(this), tokenAmount);
        (bool sent,) = address(seller).call{value: ethAmount}("");
        require(sent, "Failed to send Ether");
    }

    function withdrawToken(uint tokenAmount, address buyer) external payable onlyOwner {
        require(
            address(this).balance >= tokenAmount,
            "Not enough tokens in the reserve"
        );
        token.transfer(buyer, tokenAmount);
    }
}
