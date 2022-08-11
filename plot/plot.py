import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["figure.figsize"] = [7.50, 3.50]
plt.rcParams["figure.autolayout"] = True

columns = ["Quantidade", "Tempo", "Gas"]

df = pd.read_csv('../registerBidders.csv', delimiter=';',  names=columns)

print('Tempo (mean e std):', df['Tempo'].mean(), df['Tempo'].std())
print('Gas (mean, std, custo):', df['Gas'].mean(), df['Gas'].std(), 'R$ ' + str(round(30 / 1000000000 * df['Gas'].mean() * 8676.81, 2)))

ax = df.set_index('Quantidade').plot(secondary_y=['Gas'], mark_right=False, grid=True)

ax.set_ylabel('Tempo (ms)')
ax.right_ax.set_ylabel('Gas')


plt.savefig('plot.png')