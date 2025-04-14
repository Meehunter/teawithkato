"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DeFiLending from "../artifacts/contracts/DeFiLending.sol/DeFiLending.json";
import MeeteaToken from "../artifacts/contracts/MeeteaToken.sol/MeeteaToken.json";
import styles from "./page.module.css";

const DEFI_ADDRESS = "0x9890cc8375d4c1d8f398bf84b9e11200d47fe343"; // Ganti dengan alamat kontrak DeFiLending
const MTEA_ADDRESS = "0x5800ca65618d4e2de6b6540f44d2534ac875c2ba"; // Ganti dengan alamat kontrak MeeteaToken

export default function Home() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [supplyAmount, setSupplyAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [borrowed, setBorrowed] = useState(0);
  const [mteaBalance, setMteaBalance] = useState(0);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setProvider(provider);

      const signer = await provider.getSigner();
      const defiContract = new ethers.Contract(DEFI_ADDRESS, DeFiLending.abi, signer);
      const tokenContract = new ethers.Contract(MTEA_ADDRESS, MeeteaToken.abi, signer);
      setContract(defiContract);
      setTokenContract(tokenContract);

      updateBalances(defiContract, tokenContract, accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const updateBalances = async (defiContract, tokenContract, user) => {
    const balance = await defiContract.balances(user);
    const borrowed = await defiContract.borrows(user);
    const mteaBal = await tokenContract.balanceOf(user);
    setBalance(ethers.formatEther(balance));
    setBorrowed(ethers.formatEther(borrowed));
    setMteaBalance(ethers.formatEther(mteaBal));
  };

  const handleSupply = async () => {
    if (!contract || !supplyAmount) return;
    try {
      const amount = ethers.parseEther(supplyAmount);
      const tx = await contract.supply({ value: amount });
      await tx.wait();
      alert("Supply successful!");
      updateBalances(contract, tokenContract, account);
      setSupplyAmount("");
    } catch (error) {
      console.error(error);
      alert("Supply failed!");
    }
  };

  const handleBorrow = async () => {
    if (!contract || !borrowAmount) return;
    try {
      const amount = ethers.parseEther(borrowAmount);
      const tx = await contract.borrow(amount);
      await tx.wait();
      alert("Borrow successful!");
      updateBalances(contract, tokenContract, account);
      setBorrowAmount("");
    } catch (error) {
      console.error(error);
      alert("Borrow failed!");
    }
  };

  const handleRepay = async () => {
    if (!contract || !repayAmount) return;
    try {
      const amount = ethers.parseEther(repayAmount);
      const tx = await contract.repay({ value: amount });
      await tx.wait();
      alert("Repay successful!");
      updateBalances(contract, tokenContract, account);
      setRepayAmount("");
    } catch (error) {
      console.error(error);
      alert("Repay failed!");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Tea DeFi DApp</h1>
      {!account ? (
        <button className={styles.button} onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <p>Supplied Balance: {balance} MTEA</p>
          <p>Borrowed Amount: {borrowed} MTEA</p>
          <p>Meetea Balance: {mteaBalance} MTEA</p>

          <div>
            <h2>Supply MTEA</h2>
            <input
              type="number"
              placeholder="Amount to supply"
              value={supplyAmount}
              onChange={(e) => setSupplyAmount(e.target.value)}
            />
            <button className={styles.button} onClick={handleSupply}>Supply</button>
          </div>

          <div>
            <h2>Borrow MTEA</h2>
            <input
              type="number"
              placeholder="Amount to borrow"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
            />
            <button className={styles.button} onClick={handleBorrow}>Borrow</button>
          </div>

          <div>
            <h2>Repay MTEA</h2>
            <input
              type="number"
              placeholder="Amount to repay"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
            />
            <button className={styles.button} onClick={handleRepay}>Repay</button>
          </div>
        </div>
      )}
    </div>
  );
}
