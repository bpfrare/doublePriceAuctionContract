// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <=0.8.16;

import "./IterableMapping.sol";

interface IDoublePriceAuctionContract {

    function registerBid(uint256 _value, uint8 _sourceType) external returns (uint size);

    function placeBid(uint256 _amount) external;

    function getBid() external view returns (Bid memory);

    function getBids() external view returns (Bid[] memory value);

    function registerOffer(uint256 _value, uint8 _sourceType) external returns (uint size);

    function placeOffer(uint256 _amount) external;

    function getOffer() external view returns (Bid memory);

    function getOffers() external view returns (Bid[] memory value);

    function findOffer(address _bid) external returns (address offerAddr);

    function mcp() external returns (uint256 value);

}