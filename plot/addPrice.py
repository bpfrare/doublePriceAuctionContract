import argparse
import pandas as pd
import matplotlib.pyplot as plt

my_parser = argparse.ArgumentParser(description='Plot chart from CSV')

my_parser.add_argument('Path',
                       metavar='path',
                       type=str,
                       help='the path to csv')

dollar = 1877.95
gas_price = 30

def add_price(path):
    plt.rcParams["figure.figsize"] = [7.50, 3.50]
    plt.rcParams["figure.autolayout"] = True

    columns = ["Quantidade", "Tempo", "Gas"]

    df = pd.read_csv(path, delimiter=';',  names=columns)
    price = []
    for index, row in df.iterrows():
        price.append(gas_price / 1000000000 * row['Gas'] * dollar)
    print(price)
    df['Preço'] = price
    print(df)
    df.to_csv('teste.csv', sep=';')

    ax = df.plot(mark_right=False, grid=True, x = 'Quantidade', y = 'Preço')

    ax.set_ylabel('Preço (USD$)')
    # ax.right_ax.set_ylabel('Gas')

    plt.savefig('teste' + '.png')


if __name__ == '__main__':
    args = my_parser.parse_args()
    add_price(args.Path)
