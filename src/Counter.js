import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import React, { useState, useEffect } from 'react';
import InputDataDecoder from 'ethereum-input-data-decoder';

const web3Modal = new Web3Modal({
    network: 'http://localhost:8545',
    providerOptions: {}
});

function Counter() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState('0');
    const [contract, setContract] = useState(null);
    const [contractBalance, setContractBalance] = useState('0');
    const [contractList, setContractList] = useState([]);

    const [countNumber, setCountNumber] = useState(0);

    useEffect(() => {
        async function init() {
            // 連接錢包，取得錢包資訊
            const instance = await web3Modal.connect();
            const userProvider = new ethers.providers.Web3Provider(instance);
            const signer = userProvider.getSigner();
            const address = await signer.getAddress();
            const balance = await userProvider.getBalance(address);

            // 合約資訊
            const contractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            const abi= [
                {
                  "inputs": [],
                  "name": "count",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "dec",
                  "outputs": [],
                  "stateMutability": "payable",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "get",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "inc",
                  "outputs": [],
                  "stateMutability": "payable",
                  "type": "function"
                }
              ]
            const contract = new ethers.Contract(contractAddr, abi, signer);
            const contractBalance = await contract.provider.getBalance(contractAddr);
            const countNumber = await contract.count();

            // 取得本地測試鏈交易紀錄
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const blockNumber = await provider.getBlockNumber(); //取得最新的區塊號碼

            let list = [];
            for (var i = blockNumber; i > 2; i--) {
                let block = await provider.getBlockWithTransactions(i);
                let txReceipts = block.transactions;
                list.push(txReceipts[0]);
            }

            const contractList = list.map((tx) => {
                let decoder = new InputDataDecoder(abi); //解碼交易訊息
                return {
                    data: decoder.decodeData(tx.data), //解碼交易訊息
                    from: tx.from
                };
            });

            setContract(contract);
            setBalance(ethers.utils.formatEther(balance));
            setAddress(address);
            setCountNumber(countNumber.toNumber());
            setContractBalance(ethers.utils.formatEther(contractBalance));
            setContractList(contractList);
        }
        init();
    }, []);

    return (
        <div>
            <h1>Counter</h1>
            <p>
                Your balance is "{balance}" ETH.
                <br />
                Your Address is "{address}".
            </p>
            <div className="counter">
                <div className="result">{countNumber}</div>
                <div>
                    <button
                        onClick={() => {
                            async function countInc() {
                                let inc = await contract.inc({
                                    value: ethers.utils.parseEther('0.1')
                                });
                                await inc.wait();
                                const _inc = await contract.count();
                                setCountNumber(_inc.toNumber());
                            }
                            countInc();
                        }}
                    >
                        +1
                    </button>
                    <button
                        onClick={() => {
                            async function countInc() {
                                let dec = await contract.dec({
                                    value: ethers.utils.parseEther('0.1')
                                });
                                await dec.wait();
                                const _dec = await contract.count();
                                setCountNumber(_dec.toNumber());
                            }
                            countInc();
                        }}
                    >
                        -1
                    </button>
                </div>
                <div className="contractBalance">
                    This contract balance is
                    <br />"{contractBalance}"
                </div>
            </div>
            <div className="contractList">
                {contractList.map((tx,index) => (
                    <div className="listItem" key={index}>
                        <div className="listSigner">
                            Signer：{tx.from} "{tx.data.method}"
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Counter;
