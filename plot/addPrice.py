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

    columns = ["Quantidade", "Tempo", "Gas"]

    df = pd.read_csv(path, delimiter=';',  names=columns)
    price = []
    for _, row in df.iterrows():
        price.append(gas_price / 1000000000 * row['Gas'] * dollar)
    df['Preço'] = price
    df.to_csv(path, sep=';', header=False)


if __name__ == '__main__':
    args = my_parser.parse_args()
    add_price(args.Path)
