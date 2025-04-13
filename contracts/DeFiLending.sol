// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MeeteaToken.sol";

contract DeFiLending {
    IERC20 public nativeToken; // MTEA as the native token
    MeeteaToken public meeteaToken; // Reward token
    address public owner;

    mapping(address => uint256) public balances; // User supplied amounts
    mapping(address => uint256) public borrows; // User borrowed amounts

    uint256 public constant REWARD_PERCENTAGE = 5; // 5% reward in MTEA

    constructor(address _nativeToken, address _meeteaToken) {
        nativeToken = IERC20(_nativeToken);
        meeteaToken = MeeteaToken(_meeteaToken);
        owner = msg.sender;
    }

    function supply(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        nativeToken.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;

        uint256 reward = (amount * REWARD_PERCENTAGE) / 100;
        meeteaToken.mint(msg.sender, reward);
    }

    function borrow(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(nativeToken.balanceOf(address(this)) >= amount, "Insufficient pool balance");
        nativeToken.transfer(msg.sender, amount);
        borrows[msg.sender] += amount;

        uint256 reward = (amount * REWARD_PERCENTAGE) / 100;
        meeteaToken.mint(msg.sender, reward);
    }

    function repay(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(borrows[msg.sender] >= amount, "Invalid repay amount");
        nativeToken.transferFrom(msg.sender, address(this), amount);
        borrows[msg.sender] -= amount;

        uint256 reward = (amount * REWARD_PERCENTAGE) / 100;
        meeteaToken.mint(msg.sender, reward);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        nativeToken.transfer(msg.sender, amount);
    }
}
