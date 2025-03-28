// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationContract {
    struct Donation {
        address donor;
        address charity;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    mapping(address => Donation[]) public donationHistory;
    event DonationMade(address indexed donor, address indexed charity, uint256 amount, string message, uint256 timestamp);

    function makeDonation(address _charity, string memory _message) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(_charity != address(0), "Invalid charity address");

        Donation memory newDonation = Donation({
            donor: msg.sender,
            charity: _charity,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });

        donationHistory[msg.sender].push(newDonation);
        emit DonationMade(msg.sender, _charity, msg.value, _message, block.timestamp);

        (bool sent, ) = _charity.call{value: msg.value}("");
        require(sent, "Failed to send donation");
    }

    function getDonationHistory(address _donor) public view returns (Donation[] memory) {
        return donationHistory[_donor];
    }
} 