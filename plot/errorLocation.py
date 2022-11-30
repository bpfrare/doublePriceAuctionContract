import pandas as pd
import matplotlib.pyplot as plt


def plot():
    plt.rcParams["figure.figsize"] = [7.50, 3.50]
    plt.rcParams["figure.autolayout"] = True

    columns = ["Interação", "Solidity", "Javascript"]

    df = pd.read_csv('./results/location/errorLoc.csv', delimiter=';',  names=columns)

    ax = df.set_index('Interação').plot(mark_right=False, grid=True)

    ax.set_ylabel('Distância (m)')
    ax.set_xlabel("Interações")

    dif = df['Javascript'] - df['Solidity']
    print(dif.max())
    

    plt.savefig('./results/location/erroLoc.png')


if __name__ == '__main__':
    plot()