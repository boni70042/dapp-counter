# dapp-counter
* Runtime: Node.js、ethers.js (only work with 5.x)
* Services: MetaMask

## Installation
For global installation (may need root)

```
npm i
```

For local non-root installation
```
https://github.com/boni70042/dapp-counter.git
npm i
```
## Start the local test chain
```
npx hardhat node
```
Create private network in metamask,By default for localhost chain ID would be 1337.
Import private key to connect to localhost account.
After paste private key click on import and metamask will be connected to localhost test account to perform transactions.

## run dev server
```
npm run start
```
Open http://localhost:3000 with your browser to see the result.
