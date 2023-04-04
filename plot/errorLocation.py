import pandas as pd
import matplotlib.pyplot as plt


def plot():
    plt.rcParams["figure.figsize"] = [7.50, 3.50]
    plt.rcParams["figure.autolayout"] = True

    columns = ["Interação", "Solidity", "Javascript", "Diferença"]

    df = pd.read_csv('./results/location/errorLoc.csv', delimiter=';',  names=columns)
    
    fig, axes = plt.subplots(nrows=1,ncols=2)

    ax = df.plot(x='Interação', y='Solidity', mark_right=False, grid=True, ax=axes[0], subplots=True, xlabel="Interações", ylabel='Distância (m)')
    ax = df.plot(x='Interação', y='Javascript', mark_right=False, grid=True, ax=axes[1], subplots=True, xlabel="Interações", ylabel='Distância (m)', style='r')

    dif = df['Javascript'] - df['Solidity']
    print(dif.max())
    

    plt.savefig('./results/location/erroLoc.png')


if __name__ == '__main__':
    plot()