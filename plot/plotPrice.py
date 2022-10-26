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

def read_plot(path, name, xlabel):
    plt.rcParams["figure.figsize"] = [7.50, 3.50]
    plt.rcParams["figure.autolayout"] = True

    columns = ["Quantidade", "Tempo", "Gas", "Preço"]

    df = pd.read_csv(path, delimiter=';',  names=columns)

    ax = df.plot(mark_right=False, grid=True, x = 'Quantidade', y = 'Preço')

    ax.set_ylabel('Preço (USD$)')
    ax.set_xlabel(xlabel)

    plt.savefig(name + '.png')


if __name__ == '__main__':
    args = my_parser.parse_args()
    read_plot(args.Path, args.Name, args.Xlabel)
