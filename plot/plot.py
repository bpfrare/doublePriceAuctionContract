import argparse
import pandas as pd
import matplotlib.pyplot as plt

my_parser = argparse.ArgumentParser(description='Plot chart from CSV')

my_parser.add_argument('Path',
                       metavar='path',
                       type=str,
                       help='the path to csv')

my_parser.add_argument('Name',
                       metavar='name',
                       type=str,
                       help='Plot name')

my_parser.add_argument('Xlabel',
                       metavar='xlabel',
                       type=str,
                       help='X Label name',
                       default='Quantidade')

dollar = 1877.95
gas_price = 30

def read_plot(path, name, xlabel):
    plt.rcParams["figure.figsize"] = [7.50, 3.50]
    plt.rcParams["figure.autolayout"] = True

    columns = ["Quantidade", "Tempo", "Gas", "Price"]

    df = pd.read_csv(path, delimiter=';',  names=columns)

    del df['Price']

    print('Tempo (mean e std):', df['Tempo'].mean(), df['Tempo'].std())
    print('Gas (mean, std, custo):', df['Gas'].mean(), df['Gas'].std(), 'USD $ ' + str(round(gas_price / 1000000000 * df['Gas'].mean() * dollar , 2)))

    ax = df.set_index('Quantidade').plot(secondary_y=['Gas'], mark_right=False, grid=True)

    ax.set_ylabel('Tempo (ms)')
    ax.set_xlabel(xlabel)
    ax.right_ax.set_ylabel('Gas')

    plt.savefig(name + '.png')


if __name__ == '__main__':
    args = my_parser.parse_args()
    read_plot(args.Path, args.Name, args.Xlabel)
