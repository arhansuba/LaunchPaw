# 🚀 LaunchPaw - Token Launch Platform

LaunchPaw is a decentralized platform built on EduChain that enables users to create, launch, and trade tokens with an automated bonding curve mechanism.

## ✨ Features

* **💫 Bonding Curve Mechanism**
   * Dynamic pricing based on supply and demand
   * Fair token distribution
   * Automated price discovery

* **💧 Liquidity Management**
   * Automated liquidity pool creation
   * Built-in reward system for liquidity providers
   * Efficient token swapping

* **🔐 Security Features**
   * Verified smart contracts
   * Automated security checks
   * Transparent token mechanics

* **📊 User Dashboard**
   * Portfolio tracking
   * Transaction history
   * Performance analytics

## 🛠️ Technical Stack

* **Frontend**
  * React + TypeScript
  * Tailwind CSS
  * Framer Motion
  * wagmi/viem
  * ethers.js

* **Smart Contracts**
  * Solidity
  * Hardhat
  * OpenZeppelin

## 🚀 Getting Started

### Prerequisites

```bash
node.js >= 16.0.0
npm or yarn
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arhansuba/launchpaw.git
cd launchpaw
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd src
npm install

# Install contract dependencies
cd contracts
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start local development:
```bash
# Start local hardhat node
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Start frontend
npm run dev
```

## 📁 Project Structure

```
LaunchPaw/
├── src/                    # Frontend application
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
│
├── contracts/             # Smart contracts
│   ├── contracts/         # Contract source files
│   ├── scripts/           # Deployment scripts
│   └── test/             # Contract tests
```

## 🔧 Configuration

1. Configure your network in `src/config/chains.ts`
2. Update contract addresses in `src/config/contracts.ts`
3. Configure hardhat settings in `contracts/hardhat.config.js`

## 🧪 Testing

```bash
# Run contract tests
cd contracts
npx hardhat test

# Run frontend tests
cd src
npm test
```

## 🚀 Deployment

1. Deploy contracts:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network educhain
```

2. Build frontend:
```bash
cd src
npm run build
```

## 📝 Smart Contract Documentation

Key contracts:
- `TokenFactory.sol`: Main factory for token creation
- `NativeLiquidityPool.sol`: Handles liquidity and swaps
- `BondingCurve.sol`: Implements bonding curve mechanics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Built for the EduChain Hackathon
- Inspired by innovative DeFi platforms
- Uses OpenZeppelin contracts for security

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the team at [your contact info].

## 🔮 Future Roadmap

- [ ] Enhanced analytics dashboard
- [ ] Additional token features
- [ ] Advanced trading tools
- [ ] Mobile app development