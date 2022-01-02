# Pixell

A pixel art NFT marketplace on the Ethereum blockchain. Create, mint, buy and sell NFTs on the Ropsten Testnet.

![Pixell homepage](public/pixell.png)

## Technologies Used

![Tech Stack](public/tech-stack.png)

## Getting Started

Clone this repository and install [pnpm](https://pnpm.io).

```bash
  npm i -g pnpm
```

### Client

Make a `.env` file in the root of the repository. Refer to [.env.example](.env.example) for the environment variables required for the project. You need to set up two things to run the client:

1. **A postgreSQL database.** You could [set up a free one on Heroku](https://dev.to/prisma/how-to-setup-a-free-postgresql-database-on-heroku-1dc1). Set the value of `DATABASE_URL` as the url of the hosted database.

2. **A free Pinata account.** [Pinata](https://www.pinata.cloud/) stores all the NFT images and metadata. Create an account, generate an API key and set the values of `PINATA_API_KEY` and `PINATA_API_SECRET` respectively.

To run the development server:

```bash
  # install dependencies
  pnpm install

  # run the dev server
  pnpm dev
```

### Smart Contract

The `hardhat` directory contains all the code pertaining to the smart contracts. If you wish to play around with the smart contract code, refer to [NFT.sol](hardhat/contracts/NFT.sol). Before you compile and deploy the smart contract, make a `.env` file in the `hardhat` directory. You need to set up two things:

1. **A free Alchemy account.** The project uses [Alchemy](https://www.alchemy.com/) to interact with the Ropsten network and deploy contracts. Create an account on Alchemy, create a new project on the Ropsten network and set the value of `ALCHEMY_API_URL` as the alchemy project url. If you're stuck at this part, refer to [this guide](https://ethereum.org/en/developers/tutorials/how-to-write-and-deploy-an-nft/#make-api-key).

2. **A MetaMask account.** Your Ethereum account's private key is required to compile the contract using Hardhat. Set the value of `PRIVATE_KEY`.

To compile and deploy the smart contracts:

```bash
  # install dependencies
  pnpm install

  # compile the contract
  pnpm compile

  # deploy the contract
  pnpm deploy
```

The `pnpm deploy` command should log something like this on the console:

```
  Contract deployed to address: 0x1d2Cc2e0D387A04aD5111ee9Fd391110ddA0976F
```

Make sure to change `NEXT_PUBLIC_CONTRACT_ADDRESS` in [.env](.env) to the address of the newly deployed contract.

## Authors

- [Ananya Lohani](https://lohani.dev) | [GitHub](https://github.com/ananyalohani)
- [Mihir Chaturvedi](https://mihir.ch) | [GitHub](https://github.com/plibither8)
