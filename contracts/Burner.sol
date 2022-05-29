// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title An ERC20 Token 'Burner'
/// @author @Keyrxng
/// @notice for testnet purpopes in burning test tokens
contract Burner {

    address dead = 0x000000000000000000000000000000000000dEaD;

    uint public tokenSetsDestroyed;
    mapping(address => uint) public usersUsageCount;

    constructor() {}

    /// @notice sends all supply tokens to the 'dead' address, tracks individual usage as well as individual token set burns
    /// @param _tokens array of deployed ERC20 addresses
    function batchBurn(address[] calldata _tokens) public {
        require(_tokens.length != 0, "length is nil");

        for(uint x = 0; x < _tokens.length; x++){
            uint bal = fetchBal(_tokens[x]);
            require(bal !=0, "nil bal");
            IERC20(_tokens[x]).transferFrom(msg.sender, dead, bal);
            tokenSetsDestroyed += 1;
        }
        usersUsageCount[msg.sender] += 1;
    }

    function fetchBal(address _token) public view returns(uint) {
        return IERC20(_token).balanceOf(msg.sender);
    }
    
    /// @notice the frontend is required to invoke an approval call to each token indivually as seperate calls and does but this
    /// @notice is a catch all to approve this contract address after the mandatory Metamask approvals required on the frontend
    function approveAll(address[] calldata _tokens) public {
        for(uint x=0; x < _tokens.length; x++){
            uint bal = fetchBal(_tokens[x]);
            if(bal != 0) {
                IERC20(_tokens[x]).approve(address(this), bal);
            }
            if(bal == 0){
            continue;
            }
        }
    }
}