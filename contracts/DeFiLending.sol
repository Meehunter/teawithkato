// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MeeteaToken.sol";

contract DeFiLending {
    MeeteaToken public meeteaToken; // Reward token
    address public owner;

    mapping(address => uint256) public balances; // User supplied amounts
    mapping(address => uint256) public borrows; // User borrowed amounts

    uint256 public constant REWARD_PERCENTAGE = 5; // 5% reward in MTEA

    constructor(address _meeteaToken) {
        meeteaToken = MeeteaToken(_meeteaToken);
        owner = msg.sender;
    }

    function supply() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[msg.sender] += msg.value;

        uint256 reward = (msg.value * REWARD_PERCENTAGE) / 100;
        meeteaToken.mint(msg.sender, reward);
    }

    function borrow(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient pool balance");
        borrows[msg.sender] += amount;

        uint256 reward = (amount * REWARD_PERCENTAGE) / 100;
        meeteaToken.mint(msg.sender, reward);

        payable(msg.sender).transfer(amount);
    }

    function repay() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(borrows[msg.sender] >= msg.value, "Invalid repay amount");
        borrows[msg.sender] -= msg.value;

        uint256 reward = (msg.value * REWARD_PERCENTAGE) / 100;
        meeteaToken.mint(msg.sender, reward);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);
    }

    receive() external payable {}
}
