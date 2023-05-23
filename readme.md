<a name="readme-top"></a>

<!-- ABOUT THE PROJECT -->
## Double Price Auction in Blockchain

This project proposes the development and analysis the behavior of the double price auction in an smart contract. This contract will be able to create an order book so that producers and consumers can register their respective intentions. Two smart contracts will be implemented in Solidity programming language to operate on the Ethereum network. The first aims to establish the base market. The second will add the distance parameter as a metric for defining the price.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* nodejs 16.19.0
* npm 8.19.3
* python 3

### Installation

1. Download and install [Ganache](https://trufflesuite.com/ganache/)
2. Clone the repo
   ```sh
   git clone git@github.com:bpfrare/doublePriceAuctionContract.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

4. Install python packages (optional)
    ```sh
   cd plot && pip install -r requirements.txt
   ```

5. Start Ganache and create a new workspace with 100 accounts

6. Test the application
    ```sh
    truffle test test\base\doublePriceAuction.js
    ```

7. Plot some charts (optional)
    ```sh
    .\plot\plotSlide.py
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Deploy on Sepolia network

1. Get a free API Key at [Infura](https://www.infura.io/)

2. Enter your API Key in .secret_key

3. Enter your mnemonic of your Wallet in .secret

4. Deploy the conctracts
    ```sh
    truffle migrate --network sepolia
    ```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Bruno Frare - [in/bruno-frare/](https://www.linkedin.com/in/bruno-frare/) - bpfrare@gmail.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Truffle Suite](https://trufflesuite.com/truffle)
* [Ganache](https://trufflesuite.com/ganache/)
* [Tenderly](https://tenderly.co/)
* [Open Zeppelin](https://www.openzeppelin.com/)
* [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
* [Sepolia](https://sepolia.etherscan.io/)
* [Infura](https://www.infura.io/)
* [Gas](https://ethereum.org/pt-br/developers/docs/gas/)



<p align="right">(<a href="#readme-top">back to top</a>)</p>
