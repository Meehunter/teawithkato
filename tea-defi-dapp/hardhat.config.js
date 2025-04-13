require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
    networks: {
        teaSepolia: {
              url: "https://tea-sepolia.g.alchemy.com/public",
                    accounts: [], // Tidak perlu private key karena kita akan deploy via Remix
                          chainId: 10218,
                              },
                                },
                                };





