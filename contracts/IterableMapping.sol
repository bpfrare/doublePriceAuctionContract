// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.8;

struct Bid {
    uint256 amount;
    uint256 value;
    uint256 sourceType;
}

struct IndexValue { uint keyIndex; Bid value; }
struct KeyFlag { address key; bool deleted; }

struct itmap {
    mapping(address => IndexValue) data;
    KeyFlag[] keys;
    uint size;
}

type Iterator is uint;

library IterableMapping {
    function insert(itmap storage self, address _key, uint256 _amount, uint256 _value, uint256 _sourceType) internal returns (bool replaced) {
        uint keyIndex = self.data[_key].keyIndex;
        self.data[_key].value = Bid(_amount, _value, _sourceType);
        if (keyIndex > 0)
            return true;
        else {
            keyIndex = self.keys.length;
            self.keys.push();
            self.data[_key].keyIndex = keyIndex + 1;
            self.keys[keyIndex].key = _key;
            self.size++;
            return false;
        }
    }

    function remove(itmap storage self, address _key) internal returns (bool success) {
        uint keyIndex = self.data[_key].keyIndex;
        if (keyIndex == 0)
            return false;
        delete self.data[_key];
        self.keys[keyIndex - 1].deleted = true;
        self.size --;
    }

    function addAmount(itmap storage self, address _key, uint256 amount) internal {
        require(self.data[_key].keyIndex > 0, "User not register yet");
        self.data[_key].value.amount += amount;
    }

    function get(itmap storage self, address _key) public view returns (Bid memory) {
        require(self.data[_key].keyIndex > 0, "User not register yet");
        return self.data[_key].value;
    }

    function contains(itmap storage self, address _key) internal view returns (bool) {
        return self.data[_key].keyIndex > 0;
    }

    function iterateStart(itmap storage self) internal view returns (Iterator) {
        return iteratorSkipDeleted(self, 0);
    }

    function iterateValid(itmap storage self, Iterator iterator) internal view returns (bool) {
        return Iterator.unwrap(iterator) < self.keys.length;
    }

    function iterateNext(itmap storage self, Iterator iterator) internal view returns (Iterator) {
        return iteratorSkipDeleted(self, Iterator.unwrap(iterator) + 1);
    }

    function iterateGet(itmap storage self, Iterator iterator) internal view returns (address key, Bid memory value) {
        uint keyIndex = Iterator.unwrap(iterator);
        key = self.keys[keyIndex].key;
        value = self.data[key].value;
    }

    function iteratorSkipDeleted(itmap storage self, uint keyIndex) private view returns (Iterator) {
        while (keyIndex < self.keys.length && self.keys[keyIndex].deleted)
            keyIndex++;
        return Iterator.wrap(keyIndex);
    }
}