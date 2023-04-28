import argparse
import pandas as pd
import matplotlib.pyplot as plt

my_parser = argparse.ArgumentParser(description='Plot chart from CSV')

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

def read_plot(name, xlabel):
    plt.rcParams["figure.figsize"] = [7.50, 3.50]
    plt.rcParams["figure.autolayout"] = True

    columns = ["Quantidade", "Tempo", "Gas", "Preço"]

    df_b = pd.read_csv('results/base/' + name + '.csv', delimiter=';',  names=columns)
    df_l = pd.read_csv('results/location/' + name + '.csv', delimiter=';',  names=columns)

    ax = df_b.plot(mark_right=False, grid=True, x = 'Quantidade', y = 'Preço', xlabel='base')
    df_l.plot(ax=ax, mark_right=False, grid=True, x = 'Quantidade', y = 'Preço', ylabel='localização')

    ax.set_ylabel('Preço (USD$)')
    ax.legend(['Algoritmo Base', 'Algoritmo com localização'])
    ax.set_xlabel(xlabel)

    plt.savefig('results/slides/' + name + 'Slide.png')


if __name__ == '__main__':
    args = my_parser.parse_args()
    read_plot(args.Name, args.Xlabel)
