import pandas as pd
import matplotlib.pyplot as plt

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
    read_plot('registerBidders', 'Quantidade de Prossumidores')
    read_plot('placeBid', 'Quantidade de Compradores')
    read_plot('findOffer', 'Quantidade de Vendedores')
    read_plot('trade', 'Quantidade de Prossumidores')
    read_plot('mcp', 'Quantidade de Prossumidores')
