**📦 Blockchain-Based Supply Chain Management DApp**

A decentralized application (DApp) designed to improve transparency, traceability, and trust in supply chain systems using blockchain technology. Built with Solidity smart contracts on the Ethereum Sepolia testnet and a React.js frontend integrated with MetaMask, this system records and verifies every stage of a product’s journey—from manufacturer to customer.

**🔧 Technologies Used**

Blockchain Network: Ethereum Sepolia Testnet

Smart Contract Language: Solidity

IDE: Remix IDE (for writing and deploying smart contracts)

Frontend Framework: React.js

Blockchain Interaction: ethers.js

Wallet Integration: MetaMask

Development Server: http://localhost:3000/

**🛠️ How It Works**

The application includes three user roles with the following responsibilities:

🏭 Manufacturer

1.	Add and view products
2.	Add Retailers to the network
3.	Ship products in bulk and track shipping history
   
🏪 Retailer

1.	Place bulk orders to Manufacturers using ETH
2.	Manage product inventory
3.	Handle Customer orders and deliveries with full tracking
   
👤 Customer

1.	Browse available products from Retailers
2.	Place orders by paying in ETH
3.	Track order status and view complete order history
   
All actions are recorded immutably on the blockchain to prevent tampering and ensure real-time transparency.

**🚀How to Run the Project**

1.	Clone the Repository
   
    git clone https://github.com/sahilwasta28/Supply-Chain-using-Blockchain.git

  	cd Supply-Chain-using-Blockchain
2.	Install Dependencies                                                                                         

  	npm install
3.	Start the Development Server
   
    npm start
    Runs on: http://localhost:3000
5.	Set Up MetaMask
    Install MetaMask browser extension
    Connect to the Sepolia testnet
    Fund wallet via Sepolia Faucet
6.	Deploy Smart Contracts
    Open Remix IDE
    Paste and compile SupplyChain.sol
    Deploy to Sepolia and copy the contract address & ABI
7.	Update Frontend Configuration
    Add your contract address and ABI in the frontend file
  	
**✅ Key Features**

1.	Real-time product tracking
2.	Decentralized ETH payment between stakeholders
3.	Tamper-proof order and delivery records
4.	Role-based functionality for Manufacturer, Retailer, and Customer
   
**📸 Screenshots** 

![image](https://github.com/user-attachments/assets/f03a9540-1129-416d-b99b-7200c5255df2)
![image](https://github.com/user-attachments/assets/0c76f604-b004-4d6e-86d7-e301d91efb19)


Feel free to contribute or fork the project. ⭐ Star the repo if you found it helpful!
