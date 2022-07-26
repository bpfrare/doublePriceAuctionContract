// https://eips.ethereum.org/EIPS/eip-20
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <=0.8.15;

import "./IterableMapping.sol";

interface DoublePriceAuctionContractInterface {

    /// @param _owner The address from which the balance will be retrieved
    /// @return balance the balance
    function balanceOf(address _owner) external view returns (uint256 balance);

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transfer(address _to, uint256 _value)  external returns (bool success);

    function registerBid(uint256 _value, uint256 _sourceType) external returns (uint256);

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);

    /// @notice `msg.sender` approves `_addr` to spend `_value` tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of wei to be approved for transfer
    /// @return success Whether the approval was successful or not
    function approve(address _spender  , uint256 _value) external returns (bool success);

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return remaining Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract DoublePriceAuctionContract {

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    itmap private bids;
    itmap private offers;
    using IterableMapping for itmap;
    uint256 public totalSupply;
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX

    constructor(uint256 _initialAmount, string memory _tokenName, uint8 _decimalUnits, string  memory _tokenSymbol) {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
    }

    function registerBid(uint256 _value, uint256 _sourceType) public returns (uint size) {
        bids.insert(msg.sender, 0, _value, _sourceType);
        return bids.size;
    }

    function placeBid(uint256 _amount) public {
        bids.addAmount(msg.sender, _amount);
    }

    function getBidsSize() public view returns (uint size) {
        return bids.size;
    }

    function getBid() public view returns (Bid memory) {
        return bids.get(msg.sender);
    }

    function getBids() public view returns (Bid[] memory value) {
        value = new Bid[](bids.size);
        uint j = 0;
        for (
            Iterator i = bids.iterateStart();
            bids.iterateValid(i);
            i = bids.iterateNext(i)
        ) {
            (, Bid memory bid) = bids.iterateGet(i);
            value[j] = bid;
            j++;
        }
    }

    function registerOffer(uint256 _value, uint256 _sourceType) public returns (uint size) {
        offers.insert(msg.sender, 0, _value, _sourceType);
        return offers.size;
    }

    function placeOffer(uint256 _amount) public {
        offers.addAmount(msg.sender, _amount);
    }

    function getOffers() public view returns (Bid[] memory value) {
        value = new Bid[](offers.size);
        uint j = 0;
        for (
            Iterator i = offers.iterateStart();
            offers.iterateValid(i);
            i = offers.iterateNext(i)
        ) {
            (, Bid memory offer) = offers.iterateGet(i);
            value[j] = offer;
            j++;
        }
    }

    function getOffersSize() public view returns (uint size) {
        return offers.size;
    }

    function getOffer() public view returns (Bid memory) {
        return offers.get(msg.sender);
    }

    function findOffer(address _bid) public view returns (address offerAddr) {
        // get the buyer
        Bid memory bid = bids.get(_bid);
        // look for a seller
        for (
            Iterator i = offers.iterateStart();
            offers.iterateValid(i);
            i = offers.iterateNext(i)
        ) {
            (address _offerAddr, Bid memory _offer) = offers.iterateGet(i);
            // verify the condicions to find the seller
            if (_offerAddr != _bid && bid.value == _offer.value && _offer.amount > 0) {
                return _offerAddr;
            }
        }
    }

    function processTransaction(address _bid) public returns (bool success) {
        uint256 _value;

        // Check if the buyer has enought token
        Bid memory bid = bids.get(_bid);
        require(balances[_bid] >= bid.amount, "token balance is lower than the value requested");
        
        // find a seller, if doesn't find throw an error
        address offer = findOffer(_bid);
        require(offer != address(0), "didn't find any match");
        Bid memory bidOffer = offers.get(offer);
        
        // Check if the seller has enought energy to sell
        if (bidOffer.amount < bid.amount) {
            _value = bidOffer.amount;
        } else {
            _value = bid.amount;
        }
        
        // update the amount of energy
        bids.decAmount(_bid, _value);
        offers.decAmount(offer, _value);

        //Transfer token from buyer to seller
        balances[_bid] -= _value;
        balances[offer] += _value;
        emit Transfer(_bid, offer, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value, "token balance is lower than the value requested");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value, "token balance or allowance is lower than amount requested");
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}