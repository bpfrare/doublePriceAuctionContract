from cProfile import label
from dataclasses import dataclass, field
import matplotlib.pyplot as plt

@dataclass(order=True)
class Bid:
    amount: int = field(compare=False)
    value: int
    sort_index: int = field(init=False, repr=False)

    def __post_init__(self):
        self.sort_index = self.value
   
def map_value(data):
    return list(map(lambda x: x.value, data))

def map_amount(data):
    return list(map(lambda x: x.amount, data))

def plot(bids, offers):
    plt.rcParams["figure.figsize"] = [7.50, 3.50]
    plt.rcParams["figure.autolayout"] = True
    x_b = list(map(lambda x: x.amount, bids))
    y_b = list(map(lambda x: x.value, bids))
    x_o = list(map(lambda x: x.amount, offers))
    y_o = list(map(lambda x: x.value, offers))
    plt.step(x_b, y_b, 'o-', where='post', label='Compradores')
    plt.step(x_o, y_o, 'o-', where='post', label='Vendedores')
    plt.xlabel('Quantidade')
    plt.ylabel('Preço')
    plt.grid()
    plt.legend()
    plt.annotate('MCP', xy=(830, 150), xytext=(830, 110),
            arrowprops=dict(facecolor='black', shrink=0.05),
            )
    plt.savefig("mcp.png")
    plt.show()


def mcp(bids, offers):
    bids.sort(reverse=True)
    offers.sort()
    # plot(bids, offers)
    print(bids)
    print(offers)
    i = 0
    j = 0
    q_b = bids[0].amount
    q_o = offers[0].amount
    # is not the index, is the amount
    while(i < len(bids) or j < len(offers)):
        # print(bids[i].value, offers[j].value)
        if (bids[i].value == offers[j].value):
            print(i, j)
            print("aquii")
            return bids[i].value
        elif (bids[i].value < offers[j].value):
            # Inversion
            # Return avg
            return (bids[i].value + offers[j].value)/2
        
        #  go next
        q_b -= 1
        if (q_b == 0):
            i += 1
            q_b = bids[i].amount
        q_o -= 1

        if (q_o == 0):
            j += 1
            q_o = offers[j].amount



if __name__ == '__main__':
    pass