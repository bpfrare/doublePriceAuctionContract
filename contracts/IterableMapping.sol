// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

struct Bid {
    uint256 amount;
    uint256 value;
    uint8 sourceType;
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
    function insert(itmap storage self, address _key, uint256 _amount, uint256 _value, uint8 _sourceType) internal returns (bool replaced) {
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
        self.size--;
    }

    function addAmount(itmap storage self, address _key, uint256 amount) internal {
        require(self.data[_key].keyIndex > 0, "User not register (add)");
        self.data[_key].value.amount += amount;
    }

    function decAmount(itmap storage self, address _key, uint256 amount) internal {
        require(self.data[_key].keyIndex > 0, "User not register (dec)");
        self.data[_key].value.amount -= amount;
    }

    function get(itmap storage self, address _key) public view returns (Bid memory) {
        require(self.data[_key].keyIndex > 0, "User not register (get)");
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

    function sortDesc(itmap storage self) public returns(Bid[] memory value) {
       value = new Bid[](self.size);
       KeyFlag[] memory aux = self.keys;
       quickSortDesc(self, aux, int(0), int(self.size - 1));
       for (uint i=0; i < self.size;i++) {
            value[i] = self.data[aux[i].key].value;
        }
       return value;
    }

    function quickSortDesc(itmap storage self, KeyFlag[] memory arr, int left, int right) internal {
        int i = left;
        int j = right;
        if(i==j) return;
        Bid memory pivot = self.data[arr[uint(left + (right - left) / 2)].key].value;
        while (i <= j) {
            while (self.data[arr[uint(i)].key].value.value > pivot.value) i++;
            while (pivot.value > self.data[arr[uint(j)].key].value.value) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSortDesc(self, arr, left, j);
        if (i < right)
            quickSortDesc(self, arr, i, right);
    }

    function sortAsc(itmap storage self) public returns(Bid[] memory value) {
       value = new Bid[](self.size);
       KeyFlag[] memory aux = self.keys;
       quickSortAsc(self, aux, int(0), int(self.size - 1));
       for (uint i=0; i < self.size;i++) {
            value[i] = self.data[aux[i].key].value;
        }
       return value;
    }

    function sortAsc(Bid[] memory data) public returns(Bid[] memory) {
       quickSortAsc(data, int(0), int(data.length - 1));
       return data;
    }

    function quickSortAsc(itmap storage self, KeyFlag[] memory arr, int left, int right) internal {
        int i = left;
        int j = right;
        if(i==j) return;
        Bid memory pivot = self.data[arr[uint(left + (right - left) / 2)].key].value;
        while (i <= j) {
            while (self.data[arr[uint(i)].key].value.value < pivot.value) i++;
            while (pivot.value < self.data[arr[uint(j)].key].value.value) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSortAsc(self, arr, left, j);
        if (i < right)
            quickSortAsc(self, arr, i, right);
    }

    function quickSortAsc(Bid[] memory data, int left, int right) internal {
        int i = left;
        int j = right;
        if(i==j) return;
        Bid memory pivot = data[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (data[uint(i)].value < pivot.value) i++;
            while (pivot.value < data[uint(j)].value) j--;
            if (i <= j) {
                (data[uint(i)], data[uint(j)]) = (data[uint(j)], data[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSortAsc(data, left, j);
        if (i < right)
            quickSortAsc(data, i, right);
    }
}