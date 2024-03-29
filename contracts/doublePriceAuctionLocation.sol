// https://eips.ethereum.org/EIPS/eip-20
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9;

import "./IERC20.sol";
import "./IDoublePriceAuctionContract.sol";
import "./IterableMapping.sol";
import "./Trigonometry.sol";

contract DoublePriceAuctionLocation is IERC20, IDoublePriceAuctionContract   {
    
    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    uint256 public totalSupply;
    
    itmap private bids;
    itmap private offers;
    using IterableMapping for itmap;

    /* Location */
    mapping (address => mapping(address => uint)) private distance;
    mapping (address => Location) private location;

    uint public Ro;
    
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX

    constructor(uint256 _initialAmount, string memory _tokenName, uint8 _decimalUnits, string  memory _tokenSymbol, uint _Ro) {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
        Ro = _Ro;
    }

    function setLocation(int lat, int lng) public {
        location[msg.sender] = Location(lat, lng);

        // Is consumer
        if (bids.contains(msg.sender)) {
            for (uint i=0; i < offers.size; i++) {
                address _offer = offers.keys[i].key;
                distance[msg.sender][_offer] = calcDistance(msg.sender, _offer);
            }
        }

        // Is productor
        if (offers.contains(msg.sender)) {
            for (uint i=0; i < bids.size; i++) {
                address _bid = bids.keys[i].key;
                distance[_bid][msg.sender] = calcDistance(_bid, msg.sender);
            }
        }
    }

    function getLocation() public view returns(Location memory) {
        return location[msg.sender];
    }

    function getDistance(address a, address b) public view returns (uint) {
        return distance[a][b];
    }

    function calcDistance(address a, address b) public view returns (uint256) {
        return Trigonometry.calcDistance(location[a], location[b]);
    }

    function registerBid(uint256 _value, uint8 _sourceType) public override returns (uint size) {
        bids.insert(msg.sender, 0, _value, _sourceType);
        return bids.size;
    }

    function placeBid(uint256 _amount) public override {
        bids.addAmount(msg.sender, _amount);
    }

    function getBidsSize() public view returns (uint size) {
        return bids.size;
    }

    function getBid() public override view returns (Bid memory) {
        return bids.get(msg.sender);
    }

    function getBids() public override view returns (Bid[] memory value) {
        value = bids.toBids();
    }

    function getSortedBids() public returns (Bid[] memory value) {
        return bids.sortDesc();
    }

    function getSortedOffer() public returns (Bid[] memory value) {
        return offers.sortAsc();
    }

    function registerOffer(uint256 _value, uint8 _sourceType) public override returns (uint size) {
        offers.insert(msg.sender, 0, _value, _sourceType);
        return offers.size;
    }

    function placeOffer(uint256 _amount) public override {
        offers.addAmount(msg.sender, _amount);
    }

    function getOffers() public override view returns (Bid[] memory value) {
        value = offers.toBids();
    }

    function getOffersSize() public view returns (uint size) {
        return offers.size;
    }

    function getOffer() public override view returns (Bid memory) {
        return offers.get(msg.sender);
    }

    function costByDistance(address a, address b, uint value) internal view returns(uint) {
        return distance[a][b] + (Ro * value);
    }

    function findOffer(address _bid) public override returns (address offerAddr) {
        Iterator i = offers.iterateStart();
        (offerAddr, i) = findOffer(_bid, i);
    }

    function findOffer(address _bid, Iterator _i) internal view returns (address, Iterator) {
        // get the buyer
        Bid memory bid = bids.get(_bid);
        // seek for a seller
        for (; offers.iterateValid(_i); _i = offers.iterateNext(_i)) {
            (address _offerAddr, Bid memory _offer) = offers.iterateGet(_i);
            
            // verify the condicions to find the seller
            if (_offerAddr != _bid && _offer.amount > 0) {
                
                // Cost with distance
                uint cost_distance = costByDistance(_bid, _offerAddr, _offer.value);
                
                // If the cost with the distace is minus or equal I can buy!
                if (cost_distance <= bid.value * Ro) {
                    return (_offerAddr, _i);
                }                
            }
        }
    }

    function processTransaction(address _bid) public returns (bool success) {        

        // Check if the buyer has enought token
        Bid memory bid = bids.get(_bid);
        require(balances[_bid] >= bid.amount, "token balance is lower than the value requested");

        // initial value for exchange
        uint256 _amount = bid.amount;
        
        // find a seller, if doesn't find throw an error
        Iterator i = offers.iterateStart();
        address offer;
        Bid memory bidOffer;
        while(_amount > 0 && offers.iterateValid(i)) {
            (offer, i) = findOffer(_bid, i);
            // didn't find any match
            if (offer == address(0)) {
                return false;
            }
            bidOffer = offers.get(offer);
            
            // Check if the seller has enought energy to sell
            if (bidOffer.amount < _amount) {
                transferEnergy(_bid, offer, bidOffer.amount);
                _amount -= bidOffer.amount;
            } else {
                transferEnergy(_bid, offer, _amount);
                _amount = 0;
            }
            // jump to next
            i = offers.iterateNext(i);
        }
        return true;
    }

    function transferEnergy(address _from, address _to, uint256 _value) private returns (bool success) {
        // update the amount of energy
        bids.decAmount(_from, _value);
        offers.decAmount(_to, _value);

        //Transfer token from buyer to seller
        balances[_from] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;

    }

    function trade() public {
        for (uint i = 0; i < bids.size; i++) {
            processTransaction(bids.keys[i].key);
        }
    }

    function mcp(Bid[] memory _bids, Bid[] memory _offers) public returns(uint256 value) {
        uint256 i = 0;
        uint256 j = 0;
        while(i < bids.size || j < offers.size ) {
            if (_bids[i].value == _offers[j].value) {
                return _bids[i].value;
            } else if (_bids[i].value < _offers[j].value) {
                // Inversion
                // Return avg
                return (_bids[i].value + _offers[j].value)/2;
            } 
            
            //  Go next
            if (_bids[i].amount < _offers[j].amount) {
                i++;
            } else {
                j++;
            }            
        }
    }

    function mcp() public override returns(uint256 value) {
        Bid[] memory _bids = getSortedBids();
        Bid[] memory _offers = getSortedOffer();
        return mcp(_bids, _offers);
    }
    
    function mcp(address bid) public returns(uint256 value) {
        Bid[] memory _bids = getSortedBids();
        // Bid referencial
        Bid[] memory _offers;
        _offers = new Bid[](offers.size);
        
        uint k = 0;
        for (
            Iterator i = offers.iterateStart();
            offers.iterateValid(i);
            i = offers.iterateNext(i)
        ) {
            (address oaddr, Bid memory offer) = offers.iterateGet(i);
            _offers[k] = offer;
            _offers[k].value = costByDistance(bid, oaddr, offer.value);
            k++;
        }
        _offers = IterableMapping.sortAsc(_offers);
        return mcp(_bids, _offers);
    }

    function transfer(address _to, uint256 _value) public override  returns (bool success) {
        require(balances[msg.sender] >= _value, "token balance is lower than the value requested");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
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

    function balanceOf(address _owner) public override view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public override returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender) public override view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}