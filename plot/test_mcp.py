import unittest
from mcp import Bid, mcp



class TestMCP(unittest.TestCase):

    values = [100, 125, 150, 175, 200, 225]
    bids_list = [1000, 910, 830, 760, 700, 650]
    offer_list = [500, 650, 770, 870, 950, 1010]

    def setUp(self) -> None:
        self.bids = []
        self.offers = []
        for i, v in enumerate(self.values):
            self.bids.append(
                Bid(amount=self.bids_list[i], value=v)
            )
            self.offers.append(
                Bid(amount=self.offer_list[i], value=v)
            )
        return super().setUp()



    def test_mcp(self):
        value = mcp(self.bids, self.offers)
        self.assertEqual(value, 157)



if __name__ == '__main__':
    unittest.main()