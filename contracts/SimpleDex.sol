// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceConsumer.sol";
import "./Vault.sol";
import "hardhat/console.sol";

contract SimpleDex is Ownable {
    address public token;
    Vault public vault;
    PriceConsumerV3 public ethUsdContract;
    uint256 public ethPriceDecimals;
    uint256 public ethPrice;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor(address _token, address oracleEthUsdPrice) Ownable(msg.sender) {
        token = _token;
        ethUsdContract = new PriceConsumerV3(oracleEthUsdPrice);
        vault = new Vault(_token);
        ethPriceDecimals = ethUsdContract.getPriceDecimals();
    }

    // è possibile estrapolare questo codice e metterlo in un altra funzione internal payable?
    receive() external payable {
        (bool sent,) = payable(vault).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function buyToken() public payable {
        uint256 amountToBuy = msg.value;
        require(amountToBuy > 0, "You need to send some ether");

        ethPrice = uint256(ethUsdContract.getLatestPrice());
        uint256 amountToSend = (amountToBuy * ethPrice) /(10 ** ethPriceDecimals);

        vault.withdrawToken{value: msg.value}(amountToSend, msg.sender);
        emit Bought(amountToSend);
    }

    function sellToken(uint256 tokenAmount) external {
        require(tokenAmount > 0, "You need to sell at least some tokens");
        uint256 allowance = IERC20(token).allowance(msg.sender, address(this));
        require(allowance >= tokenAmount,"Check the token allowance. It must be >= amount");

        ethPrice = uint256(ethUsdContract.getLatestPrice());
        uint256 amountToSend = (tokenAmount * (1 ** ethPriceDecimals)) / ethPrice;

        SafeERC20.safeTransferFrom(IERC20(token), msg.sender, address(this), tokenAmount);
        IERC20(token).approve(address(vault), tokenAmount);
        vault.depositToken(amountToSend, tokenAmount, msg.sender);
        emit Sold(tokenAmount);
    }
}
