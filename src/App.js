import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Replace this with your complete contract ABI
const SupplyChainABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_retailer",
				"type": "address"
			}
		],
		"name": "addRetailer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "createProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			}
		],
		"name": "CustomerOrderPlaced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "InventoryUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum SupplyChain.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "updatedBy",
				"type": "address"
			}
		],
		"name": "OrderStatusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_shippingAddress",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_retailer",
				"type": "address"
			}
		],
		"name": "placeCustomerOrder",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "placeRetailerOrder",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ProductCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			}
		],
		"name": "RetailerAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "RetailerOrderPlaced",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "updateManufacturerShipment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "trackingNumber",
				"type": "string"
			}
		],
		"name": "updateRetailerShipment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "customerOrders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPrice",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "shippingAddress",
				"type": "string"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "customers",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllCustomers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllRetailers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_customer",
				"type": "address"
			}
		],
		"name": "getCustomerOrders",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "orderId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "shippingAddress",
						"type": "string"
					},
					{
						"internalType": "enum SupplyChain.Status",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "customer",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "retailer",
						"type": "address"
					}
				],
				"internalType": "struct SupplyChain.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "getManufacturerUpdates",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "updatedBy",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isManufacturerUpdate",
						"type": "bool"
					}
				],
				"internalType": "struct SupplyChain.OrderTimeline[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "getOrderRetailer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPendingOrders",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "orderId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "shippingAddress",
						"type": "string"
					},
					{
						"internalType": "enum SupplyChain.Status",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "customer",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "retailer",
						"type": "address"
					}
				],
				"internalType": "struct SupplyChain.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPendingRetailerOrders",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "orderId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "shippingAddress",
						"type": "string"
					},
					{
						"internalType": "enum SupplyChain.Status",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "customer",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "retailer",
						"type": "address"
					}
				],
				"internalType": "struct SupplyChain.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "",
				"type": "uint8"
			},
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_retailer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "getRetailerInventory",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_retailer",
				"type": "address"
			}
		],
		"name": "getRetailerOrders",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "orderId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "shippingAddress",
						"type": "string"
					},
					{
						"internalType": "enum SupplyChain.Status",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "customer",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "retailer",
						"type": "address"
					}
				],
				"internalType": "struct SupplyChain.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "getRetailerUpdates",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "updatedBy",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isManufacturerUpdate",
						"type": "bool"
					}
				],
				"internalType": "struct SupplyChain.OrderTimeline[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isRetailer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manufacturer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "manufacturerToRetailerTimeline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "updatedBy",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isManufacturerUpdate",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "orderCount",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ordersById",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPrice",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "shippingAddress",
				"type": "string"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orderToRetailer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orderToRetailerMapping",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productCount",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productOrders",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "manufacturer",
				"type": "address"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "retailerInventory",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "retailerOrders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPrice",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "shippingAddress",
				"type": "string"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "retailer",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "retailers",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "retailerToCustomerTimeline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "updatedBy",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isManufacturerUpdate",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0x8ef20532a7d473a0986de900d9c7c993c5a49aee";

function App() {
  // State management
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [retailerOrders, setRetailerOrders] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingRetailerOrders, setPendingRetailerOrders] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    customerOrders: false,
    retailerOrders: false,
    pendingOrders: false,
    pendingRetailerOrders: false,
    transactions: false
  });
  const [userRole, setUserRole] = useState('customer');
  const [localOrderStatuses, setLocalOrderStatuses] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [updateData, setUpdateData] = useState({
    id: '',
    status: 0,
    location: '',
    notes: '',
    retailerAddress: '',
    orderIndex: 0,
    customerAddress: '',
    trackingNumber: ''
  });
  const [orderData, setOrderData] = useState({
    productId: '',
    quantity: 1,
    shippingAddress: '',
    totalPrice: '0.00', // Initialize with string format
    retailer: ''
  });
  const [retailerOrderData, setRetailerOrderData] = useState({
    productId: '',
    quantity: 1,
    totalPrice: '0'
  });
  const [productUpdates, setProductUpdates] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [balance, setBalance] = useState('0');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [errors, setErrors] = useState({
    customerOrders: null,
    retailerOrders: null,
    pendingOrders: null,
    pendingRetailerOrders: null,
    products: null
  });
  const [retailers, setRetailers] = useState([]);
  const [retailerInventory, setRetailerInventory] = useState({});
  const [newRetailerAddress, setNewRetailerAddress] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState(null);
  const [activeTab, setActiveTab] = useState('incoming');
  const [forceRefresh, setForceRefresh] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
const [refreshCounter, setRefreshCounter] = useState(0);
  // Add these right after your existing state declarations
const [inventoryRefreshTrigger, setInventoryRefreshTrigger] = useState(false);
const [ordersRefreshTrigger, setOrdersRefreshTrigger] = useState(false);

  // Initialize the application
  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask!");
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const supplyChainContract = new ethers.Contract(contractAddress, SupplyChainABI, signer);

        setContract(supplyChainContract);
        setAccount(accounts[0]);

        await loadProducts(supplyChainContract);
        await loadRetailers(supplyChainContract);
        await determineUserRole(supplyChainContract, accounts[0]);

        const bal = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(bal));

        setInitializing(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setInitError(error.message);
        setInitializing(false);
      }
    };

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0 && accounts[0] !== account) {
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const supplyChainContract = new ethers.Contract(contractAddress, SupplyChainABI, signer);
        setContract(supplyChainContract);
        
        // Force reload all data
        await loadProducts(supplyChainContract);
        await loadRetailers(supplyChainContract);
        await determineUserRole(supplyChainContract, accounts[0]);
        await loadCustomerOrders(contract, false);
        await loadCustomerOrders(contract, true);
        
        const bal = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(bal));
      }
    };
  
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    init();
  
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, [account]);

  // Add this useEffect right after your existing initialization useEffect
  useEffect(() => {
    if (!contract) return;
  
    const handleStatusUpdate = (orderId, status, updatedBy) => {
      const statusNum = status;
      console.log(`Status update received: Order ${orderId} -> ${statusNum}`);
  
      // Update all relevant state
      setPendingRetailerOrders(prev => 
        prev.map(order => 
          order.orderId === orderId.toNumber() 
            ? { ...order, status: statusNum } 
            : order
        ).filter(order => order.status !== 2) // Remove delivered orders
      );
  
      setRetailerOrders(prev => 
        prev.map(order => 
          order.orderId === orderId.toNumber() 
            ? { ...order, status: statusNum } 
            : order
        ).filter(order => order.status !== 2)
      );
  
      setCustomerOrders(prev => 
        prev.map(order => 
          order.orderId === orderId.toNumber() 
            ? { ...order, status: statusNum } 
            : order
        ).filter(order => order.status !== 2)
      );
  
      setPendingOrders(prev => 
        prev.map(order => 
          order.orderId === orderId.toNumber() 
            ? { ...order, status: statusNum } 
            : order
        ).filter(order => order.status !== 2)
      );
  
      // Force refresh if needed
      setForceRefresh(prev => !prev);
    };
  
    const handleInventoryUpdate = (retailer, productId, quantity) => {
      setRetailerInventory(prev => ({
        ...prev,
        [retailer]: {
          ...prev[retailer],
          [productId]: quantity.toNumber()
        }
      }));
    };
  
    // Set up event listeners
    contract.on("OrderStatusUpdated", handleStatusUpdate);
    contract.on("InventoryUpdated", handleInventoryUpdate);
  
    return () => {
      contract.off("OrderStatusUpdated", handleStatusUpdate);
      contract.on("InventoryUpdated", handleInventoryUpdate);
    };
  }, [contract]);

// Update the loadRetailers function to properly handle inventory
const loadRetailers = async (contractInstance) => {
  try {
    const retailerList = await contractInstance.getAllRetailers();
    const freshInventory = {};
    
    // Load all products first if not already loaded
    if (products.length === 0) {
      await loadProducts(contractInstance);
    }
    
    for (const retailer of retailerList) {
      freshInventory[retailer] = {};
      for (const product of products) {
        try {
          const inventory = await contractInstance.getRetailerInventory(
            retailer, 
            product.id
          );
          freshInventory[retailer][product.id] = inventory.toNumber();
        } catch (error) {
          console.error(`Error loading inventory for product ${product.id}:`, error);
          freshInventory[retailer][product.id] = 0;
        }
      }
    }
    
    setRetailers(retailerList);
    setRetailerInventory(freshInventory);
  } catch (error) {
    console.error("Error loading retailers:", error);
  }
};
  // Enhanced inventory sync function
  const syncInventory = async (retailerAddress, productId) => {
    try {
      const inventory = await contract.getRetailerInventory(retailerAddress, productId);
      setRetailerInventory(prev => ({
        ...prev,
        [retailerAddress]: {
          ...prev[retailerAddress],
          [productId]: inventory.toNumber()
        }
      }));
      return inventory.toNumber();
    } catch (error) {
      console.error("Error syncing inventory:", error);
      return 0;
    }
  };

  // Enhanced order status management
  const getCombinedStatus = (order) => {
    const localStatus = localOrderStatuses[order.orderId];
    if (localStatus) {
      return localStatus.status;
    }
    return ["Created", "In Transit", "Delivered"][order.status];
  };

  const determineUserRole = async (contractInstance, account) => {
    try {
      const manufacturer = await contractInstance.manufacturer();
      if (account.toLowerCase() === manufacturer.toLowerCase()) {
        setUserRole('manufacturer');
        await loadPendingOrders(contractInstance);
        await loadPendingRetailerOrders(contractInstance);
        return;
      }

      const isRetailer = await contractInstance.isRetailer(account);
      if (isRetailer) {
        setUserRole('retailer');
        await loadRetailerOrders(contractInstance, account);
        await loadCustomerOrders(contractInstance, account);
        return;
      }

      setUserRole('customer');
      await loadCustomerOrders(contractInstance, account);
    } catch (error) {
      console.error("Error determining user role:", error);
      setUserRole('customer');
    }
  };
  
  const SharedInventoryTable = ({ inventoryData, products }) => {
    return (
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => {
              const qty = inventoryData[product.id] || 0;
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qty} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      qty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {qty > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  const loadProducts = async (contractInstance) => {
    setLoading(prev => ({ ...prev, products: true }));
    setErrors(prev => ({ ...prev, products: null }));

    try {
      const productCount = await contractInstance.productCount();
      const fetchedProducts = [];

      for (let i = 1; i <= productCount; i++) {
        try {
          const product = await contractInstance.getProduct(i);
          fetchedProducts.push({
            id: product[0].toNumber(),
            name: product[1],
            description: product[2],
            price: ethers.utils.formatEther(product[3]),
            manufacturer: product[4],
            status: product[5],
            timestamp: new Date(product[6].toNumber() * 1000).toLocaleString()
          });
        } catch (error) {
          console.error(`Error loading product ${i}:`, error);
        }
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      setErrors(prev => ({ ...prev, products: "Failed to load products" }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };
  
  useEffect(() => {
    if (!contract || !account) return;
  
    const refreshData = async () => {
      try {
        await loadProducts(contract);
        await loadRetailers(contract);
        
        if (userRole === 'manufacturer') {
          await loadPendingRetailerOrders(contract);
        } else if (userRole === 'retailer') {
          await loadRetailerOrders(contract, account);
          await loadCustomerOrders(contract, true); // true for retailer view
        } else {
          await loadCustomerOrders(contract, account);
        }
      } catch (error) {
        console.error("Error during refresh:", error);
      }
    };
  
    // Refresh immediately when these change
    refreshData();
  
    // Also set up interval refresh every 15 seconds
    const interval = setInterval(refreshData, 15000);
    
    return () => clearInterval(interval);
  }, [contract, account, userRole, lastUpdateTime, refreshCounter]);
  
  const loadCustomerOrders = async (contractInstance, isRetailer = false) => {
    setLoading(prev => ({ ...prev, customerOrders: true }));
    setErrors(prev => ({ ...prev, customerOrders: null }));
  
    try {
      let fetchedOrders = [];
      
      if (isRetailer) {
        const allCustomers = await contractInstance.getAllCustomers();
        
        for (const customer of allCustomers) {
          const orders = await contractInstance.getCustomerOrders(customer);
          
          for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            // Skip delivered orders for retailer view
            if (order.status === 2) continue;
            
            const product = await contractInstance.getProduct(order.productId);
            const retailer = await contractInstance.getOrderRetailer(order.orderId);
            const updates = await contractInstance.getRetailerUpdates(order.orderId);
            
            fetchedOrders.push({
              orderId: order.orderId.toNumber(),
              productId: order.productId.toNumber(),
              productName: product[1],
              quantity: order.quantity.toNumber(),
              totalPrice: ethers.utils.formatEther(order.totalPrice),
              shippingAddress: order.shippingAddress,
              status: order.status,
              orderDate: new Date(order.timestamp.toNumber() * 1000).toLocaleString(),
              timestamp: order.timestamp.toNumber(),
              customer: order.customer,
              retailer: retailer || product[4],
              timeline: updates.map(u => ({
                status: u.status,
                location: u.location,
                timestamp: u.timestamp.toNumber(),
                updatedBy: u.updatedBy
              }))
            });
          }
        }
      } else {
        // For customers - get only their own orders
        const orders = await contractInstance.getCustomerOrders(account);
        
        for (let i = 0; i < orders.length; i++) {
          const order = orders[i];
          const product = await contractInstance.getProduct(order.productId);
          const updates = await contractInstance.getRetailerUpdates(order.orderId);
          
          fetchedOrders.push({
            orderId: order.orderId.toNumber(),
            productId: order.productId.toNumber(),
            productName: product[1],
            quantity: order.quantity.toNumber(),
            totalPrice: ethers.utils.formatEther(order.totalPrice),
            shippingAddress: order.shippingAddress,
            status: order.status,
            orderDate: new Date(order.timestamp.toNumber() * 1000).toLocaleString(),
            timestamp: order.timestamp.toNumber(),
            customer: order.customer,
            retailer: product[4],
            timeline: updates.map(u => ({
              status: u.status,
              location: u.location,
              timestamp: u.timestamp.toNumber(),
              updatedBy: u.updatedBy
            }))
          });
        }
      }
  
      setCustomerOrders(fetchedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setErrors(prev => ({ ...prev, customerOrders: "Failed to load orders" }));
      setCustomerOrders([]);
    } finally {
      setLoading(prev => ({ ...prev, customerOrders: false }));
    }
  };

  const loadRetailerOrders = async (contractInstance, retailerAddress) => {
    setLoading(prev => ({ ...prev, retailerOrders: true }));
    
    try {
      const orders = await contractInstance.getRetailerOrders(retailerAddress);
      const fetchedOrders = [];
  
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        // Skip delivered orders (status = 2)
        if (order.status === 2) continue;
        
        const product = await contractInstance.getProduct(order.productId);
        const updates = await contractInstance.getManufacturerUpdates(order.orderId);
  
        fetchedOrders.push({
          orderIndex: i,
          orderId: order.orderId.toNumber(),
          productId: order.productId.toNumber(),
          productName: product[1],
          quantity: order.quantity.toNumber(),
          totalPrice: ethers.utils.formatEther(order.totalPrice),
          status: order.status,
          orderDate: new Date(order.timestamp.toNumber() * 1000).toLocaleString(),
          manufacturerUpdates: updates.map(u => ({
            status: u.status,
            location: u.location,
            timestamp: new Date(u.timestamp.toNumber() * 1000)
          }))
        });
      }
  
      setRetailerOrders(fetchedOrders.sort((a, b) => a.orderId - b.orderId));
    } catch (error) {
      console.error("Error loading retailer orders:", error);
    } finally {
      setLoading(prev => ({ ...prev, retailerOrders: false }));
    }
  };

  const loadPendingOrders = async (contractInstance) => {
    setLoading(prev => ({ ...prev, pendingOrders: true }));
    setErrors(prev => ({ ...prev, pendingOrders: null }));

    try {
      const orders = await contractInstance.getPendingOrders();
      const fetchedOrders = [];

      for (let i = 0; i < orders.length; i++) {
        try {
          const order = orders[i];
          const product = await contractInstance.getProduct(order.productId);

          fetchedOrders.push({
            orderId: order.orderId.toNumber(),
            customer: order.customer,
            productId: order.productId.toNumber(),
            productName: product[1],
            quantity: order.quantity.toNumber(),
            totalPrice: ethers.utils.formatEther(order.totalPrice),
            shippingAddress: order.shippingAddress,
            status: order.status,
            orderDate: new Date(order.timestamp.toNumber() * 1000).toLocaleString()
          });
        } catch (error) {
          console.error(`Error processing pending order ${i}:`, error);
        }
      }

      setPendingOrders(fetchedOrders);
    } catch (error) {
      console.error("Error loading pending orders:", error);
      setErrors(prev => ({ ...prev, pendingOrders: "Failed to load pending orders" }));
      setPendingOrders([]);
    } finally {
      setLoading(prev => ({ ...prev, pendingOrders: false }));
    }
  };

  const loadPendingRetailerOrders = async (contractInstance) => {
    setLoading(prev => ({ ...prev, pendingRetailerOrders: true }));
    
    try {
      const orders = await contractInstance.getPendingRetailerOrders();
      const fetchedOrders = [];
  
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const product = await contractInstance.getProduct(order.productId);
        const updates = await contractInstance.getManufacturerUpdates(order.orderId);
  
        fetchedOrders.push({
          orderId: order.orderId.toNumber(),
          retailer: order.customer,
          productId: order.productId.toNumber(),
          productName: product[1],
          quantity: order.quantity.toNumber(),
          totalPrice: ethers.utils.formatEther(order.totalPrice),
          status: order.status,
          orderDate: new Date(order.timestamp.toNumber() * 1000).toLocaleString(),
          manufacturerUpdates: updates.map(u => ({
            status: u.status,
            location: u.location,
            timestamp: new Date(u.timestamp.toNumber() * 1000),
            updatedBy: u.updatedBy
          }))
        });
      }
  
      setPendingRetailerOrders(fetchedOrders);
    } catch (error) {
      console.error("Error loading pending retailer orders:", error);
    } finally {
      setLoading(prev => ({ ...prev, pendingRetailerOrders: false }));
    }
  };

  const addRetailer = async () => {
    if (!newRetailerAddress) {
      alert("Please enter a retailer address");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      setTransactionStatus("Adding retailer...");

      const tx = await contract.addRetailer(newRetailerAddress);
      await tx.wait();

      alert("Retailer added successfully!");
      setNewRetailerAddress('');
      await loadRetailers(contract);
    } catch (error) {
      console.error("Error adding retailer:", error);
      alert(`Failed to add retailer: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
      setTransactionStatus("");
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading({...loading, transactions: true});
      const priceInWei = ethers.utils.parseEther(formData.price);
      const tx = await contract.createProduct(formData.name, formData.description, priceInWei);
      await tx.wait();
      
      setProducts([...products, {
        id: products.length + 1,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        manufacturer: account,
        status: 0,
        timestamp: new Date().toLocaleString()
      }]);
      
      setFormData({ name: '', description: '', price: '' });
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading({...loading, transactions: false});
    }
  };

  const viewRetailerInventory = async (retailerAddress) => {
    try {
      const inventory = {};
      for (const product of products) {
        const quantity = await contract.getRetailerInventory(retailerAddress, product.id);
        inventory[product.id] = quantity.toNumber();
      }
      setSelectedRetailer(retailerAddress);
      setRetailerInventory(prev => ({
        ...prev,
        [retailerAddress]: inventory
      }));
      setShowInventoryModal(true);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      alert("Failed to load inventory");
    }
  };

  const updateManufacturerShipment = async (orderId, status, location) => {
    try {
      setLoading({ transactions: true });
      
      // Convert to contract-compatible status
      const contractStatus = status === "In Transit" ? "IN_TRANSIT" : "DELIVERED";
      
      const tx = await contract.updateManufacturerShipment(
        orderId,
        contractStatus,
        location
      );
      
      await tx.wait();
      
      // Force immediate UI update
      setPendingRetailerOrders(prev => 
        prev.filter(order => order.orderId !== orderId)
      );
      
      setRetailerOrders(prev => 
        prev.filter(order => order.orderId !== orderId)
      );
      
      // Trigger full data refresh after 2 seconds
      setTimeout(() => {
        setLastUpdateTime(Date.now());
        setRefreshCounter(prev => prev + 1);
      }, 2000);
      
      alert(`Status updated to ${status} successfully!`);
    } catch (error) {
      console.error("Error updating shipment:", error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setLoading({ transactions: false });
    }
  };

  const updateRetailerShipment = async (orderId, status, trackingNumber) => {
    try {
      setLoading({ transactions: true });
      
      const tx = await contract.updateRetailerShipment(
        orderId,
        status,
        trackingNumber
      );
      
      await tx.wait();
      
      // Force immediate UI update
      setCustomerOrders(prev => 
        prev.filter(order => order.orderId !== orderId)
      );
      
      // Trigger full data refresh after 2 seconds
      setTimeout(() => {
        setLastUpdateTime(Date.now());
        setRefreshCounter(prev => prev + 1);
      }, 2000);
      
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating delivery:", error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setLoading({ transactions: false });
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    
    if (!orderData.productId || !orderData.shippingAddress || !orderData.retailer) {
      alert("Please fill in all fields");
      return;
    }
  
    try {
      setLoading({...loading, transactions: true});
      setTransactionStatus("Placing order...");

       // Get available quantity
    const availableQty = retailerInventory[orderData.retailer]?.[orderData.productId] || 0;
    const requestedQty = parseInt(orderData.quantity) || 0;
    
    // Validate quantity
    if (requestedQty > availableQty) {
      throw new Error(`Only ${availableQty} units available`);
    }
      
      // Get product details directly from contract
      const product = await contract.getProduct(orderData.productId);
  
      // Get price in Wei from contract
      const productPriceWei = product[3]; // Already in Wei from contract
      const quantity = parseInt(orderData.quantity) || 1;
  
      // Calculate retail price in Wei (120% of manufacturer price)
      const retailPriceWei = productPriceWei.mul(120).div(100);
      const totalPriceWei = retailPriceWei.mul(requestedQty);
  
      // Check inventory
      const inventory = await contract.getRetailerInventory(orderData.retailer, orderData.productId);
      if (inventory.lt(quantity)) {
        throw new Error(`Only ${inventory.toString()} units available`);
      }
  
      // Send transaction
      const tx = await contract.placeCustomerOrder(
        orderData.productId,
        quantity,
        orderData.shippingAddress,
        orderData.retailer,
        { 
          value: totalPriceWei,
          gasLimit: 1000000
        }
      );
      
      const receipt = await tx.wait();
      if (receipt.status === 0) throw new Error("Transaction reverted");
  
      // Refresh and reset
      await Promise.all([
        loadCustomerOrders(contract, account),
        loadRetailers(contract)
      ]);
      
      setOrderData({
        productId: '',
        quantity: 1,
        shippingAddress: '',
        totalPrice: '0.00',
        retailer: ''
      });
      
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Order error:", error);
      alert(`Failed: ${error.message.includes("revert") ? 
        "Transaction failed (check console)" : 
        error.message}`);
    } finally {
      setLoading({...loading, transactions: false});
      setTransactionStatus("");
    }
  };

  const placeRetailerOrder = async (e) => {
    e.preventDefault();
    if (!retailerOrderData.productId || !retailerOrderData.quantity) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      setTransactionStatus("Placing bulk order...");
      const selectedProduct = products.find(p => p.id === parseInt(retailerOrderData.productId));
      if (!selectedProduct) {
        throw new Error("Selected product not found");
      }

      const totalPriceWei = ethers.utils.parseEther(
        (parseFloat(selectedProduct.price) * parseInt(retailerOrderData.quantity)).toString()
      );

      const tx = await contract.placeRetailerOrder(
        retailerOrderData.productId,
        retailerOrderData.quantity,
        { value: totalPriceWei }
      );
      await tx.wait();

      alert("Bulk order placed successfully!");
      setRetailerOrderData({ productId: '', quantity: 1, totalPrice: '0' });
      await loadRetailerOrders(contract, account);

      // Update balance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const bal = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(bal));
    } catch (error) {
      console.error("Error placing retailer order:", error);
      alert(`Failed to place bulk order: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
      setTransactionStatus("");
    }
  };

  const loadManufacturerUpdates = async (orderId) => {
    try {
      const updates = await contract.getManufacturerUpdates(orderId); // Changed from productId
      setProductUpdates(updates.map(u => ({
        ...u,
        timestamp: new Date(u.timestamp.toNumber() * 1000).toLocaleString(),
        status: u.status,
        location: u.location,
        updatedBy: u.updatedBy
      })));
    } catch (error) {
      console.error("Error loading manufacturer updates:", error);
      alert("Failed to load manufacturer updates");
    }
  };

  const loadRetailerUpdates = async (orderId) => {
    try {
      const updates = await contract.getRetailerUpdates(orderId); // Changed from productId
      setProductUpdates(updates.map(u => ({
        ...u,
        timestamp: new Date(u.timestamp.toNumber() * 1000).toLocaleString(),
        status: u.status,
        location: u.location,
        updatedBy: u.updatedBy
      })));
    } catch (error) {
      console.error("Error loading retailer updates:", error);
      alert("Failed to load retailer updates");
    }
  };

  const getStatusString = (status) => {
    return ["Created", "In Transit", "Delivered"][status] || "Unknown";
  };

  // Timeline Components
  const ManufacturerTimeline = ({ updates }) => {
    if (!updates || updates.length === 0) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p className="text-gray-500">No tracking data available yet</p>
        </div>
      );
    }
  
    return (
      <div className="manufacturer-timeline mt-4">
        <h3 className="font-semibold mb-2">Manufacturer Shipment Progress</h3>
        <div className="space-y-3">
          {updates.map((update, i) => (
            <div key={i} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
              <div className="flex justify-between">
                <span className="font-medium">
                  {update.status === "IN_TRANSIT" ? "In Transit" : 
                   update.status === "DELIVERED" ? "Delivered" : update.status}
                </span>
                <span className="text-sm text-gray-500">
                  {update.timestamp.toLocaleString()}
                </span>
              </div>
              <p className="text-sm">Location: {update.location}</p>
              <p className="text-xs text-gray-500 mt-1">
                Updated by: {`${update.updatedBy.substring(0, 6)}...${update.updatedBy.substring(38)}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RetailerTimeline = ({ updates = [], shippingAddress = '', customerAddress = '', retailerAddress = '', order = null }) => {
    // Improved helper functions with robust error handling
    const formatTimestamp = (timestamp) => {
      try {
        // Handle different timestamp formats
        if (!timestamp) return new Date().toLocaleString(); // Default to current time if no timestamp
        
        let date;
        if (typeof timestamp === 'object' && timestamp.toNumber) {
          // Handle BigNumber objects from blockchain
          date = new Date(timestamp.toNumber() * 1000);
        } else if (typeof timestamp === 'number') {
          // Handle regular number timestamps
          date = new Date(timestamp > 1e12 ? timestamp : timestamp * 1000);
        } else if (typeof timestamp === 'string') {
          // Handle string dates
          date = new Date(timestamp);
        } else {
          return new Date().toLocaleString();
        }
        
        return isNaN(date.getTime()) ? new Date().toLocaleString() : date.toLocaleString();
      } catch (e) {
        console.error("Error formatting timestamp:", e);
        return new Date().toLocaleString(); // Fallback to current time
      }
    };
  
    const formatAddress = (address) => {
      try {
        if (!address || typeof address !== 'string' || address.length < 10) {
          return customerAddress ? formatAddress(customerAddress) : 'Not available';
        }
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      } catch (e) {
        return 'Not available';
      }
    };
  
    // Ensure we have the shipping address
    const actualShippingAddress = shippingAddress || 
                                 (order?.shippingAddress) || 
                                 'Please check your delivery information';
  
    // Ensure we have the customer address
    const actualCustomerAddress = customerAddress || 
                                 (order?.customer) || 
                                 'Customer information not available';
  
    // Get correct order timestamp (include fallbacks)
    const orderTimestamp = order?.timestamp || 
                           order?.orderDate || 
                           (updates[0]?.timestamp) || 
                           Math.floor(Date.now() / 1000);
    
    // Create a standardized timeline with all possible states
    const orderId = order?.orderId || '1';
    
    // Add statuses to updates if missing
    let hasOrderReceived = false;
    let hasPacked = false;
    let hasShipped = false;
    let hasDelivered = false;
    
    // Check what statuses exist in the updates
    updates.forEach(update => {
      if (update.status === "ORDER_RECEIVED") hasOrderReceived = true;
      if (update.status === "PACKED") hasPacked = true;
      if (update.status === "SHIPPED") hasShipped = true;
      if (update.status === "DELIVERED") hasDelivered = true;
    });
    
    // Create a complete timeline with all statuses
    const completeTimeline = [];
    
    // 1. Always start with ORDER PLACED
    completeTimeline.push({
      status: "ORDER PLACED",
      timestamp: orderTimestamp,
      isSystemGenerated: true
    });
    
    // 2. Add ORDER RECEIVED if missing
    if (!hasOrderReceived) {
      completeTimeline.push({
        status: "ORDER_RECEIVED",
        timestamp: typeof orderTimestamp === 'number' ? orderTimestamp + 60 : orderTimestamp,
        isSystemGenerated: true
      });
    }
    
    // 3. Add all actual updates
    updates.forEach(update => {
      completeTimeline.push(update);
    });
  
    return (
      <div className="retailer-timeline mt-4">
        <h3 className="font-semibold mb-2">Delivery Progress</h3>
        <div className="space-y-3">
          {/* Render all timeline items */}
          {completeTimeline.map((update, i) => {
            const isOrderPlaced = update.status === "ORDER PLACED";
            const isOrderReceived = update.status === "ORDER_RECEIVED";
            const isPacked = update.status === "PACKED";
            const isShipped = update.status === "SHIPPED";
            const isDelivered = update.status === "DELIVERED";
            
            // Determine tracking number based on status
            const trackingNumber = isPacked ? `PKG-${orderId}` :
                                  isShipped ? `TRK-${orderId}` :
                                  isDelivered ? `DLV-${orderId}` : '';
            
            return (
              <div 
                key={i}
                className={`p-3 rounded border-l-4 ${
                  isDelivered ? 'bg-green-50 border-green-500' :
                  isShipped ? 'bg-blue-100 border-blue-400' :
                  isPacked ? 'bg-yellow-50 border-yellow-400' :
                  isOrderPlaced ? 'bg-blue-50 border-blue-500' :
                  'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {update.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(update.timestamp)}
                  </span>
                </div>
                
                {isOrderPlaced && (
                  <>
                    <p className="text-sm font-medium">Shipping Address: {actualShippingAddress}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Customer: {formatAddress(actualCustomerAddress)}
                    </p>
                  </>
                )}
                
                {isOrderReceived && (
                  <p className="text-sm">
                    Received by: {formatAddress(retailerAddress)}
                  </p>
                )}
  
                {isPacked && (
                  <>
                    <p className="text-sm">Location: Mumbai</p>
                    <p className="text-sm font-medium">Tracking ID: {trackingNumber}</p>
                  </>
                )}
  
                {isShipped && (
                  <>
                    <p className="text-sm">Location: Mumbai</p>
                    <p className="text-sm font-medium">Tracking ID: {trackingNumber}</p>
                  </>
                )}
  
                {isDelivered && (
                  <>
                    <p className="text-sm">Delivered to: {actualShippingAddress}</p>
                    <p className="text-sm font-medium">Tracking ID: {trackingNumber}</p>
                  </>
                )}
  
                {!update.isSystemGenerated && !isOrderPlaced && (
                  <p className="text-xs text-gray-500 mt-1">
                    Updated by: {formatAddress(update.updatedBy || retailerAddress)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Order Card Component
  const OrderCard = ({ order, role, onTrack }) => {
    return (
      <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Order #{order.orderId}</h3>
            <p className="text-sm text-gray-600">
              {order.productName} × {order.quantity}
            </p>
            {role === 'retailer' && order.customer && (
              <p className="text-xs mt-1">
                Customer: {`${order.customer.substring(0, 6)}...${order.customer.substring(38)}`}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm mt-1">{order.totalPrice} ETH</p>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Ordered: {order.orderDate}
          </p>
          <button
            onClick={onTrack}
            className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
          >
            Track Order
          </button>
        </div>
      </div>
    );
  };

  // Loading and Error States
  if (initializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold text-lg">Initialization Error</h2>
          <p>{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

 // Main App Render
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Blockchain-based Supply Chain</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not connected'}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userRole === 'manufacturer' ? 'bg-purple-600 text-white' :
                userRole === 'retailer' ? 'bg-orange-500 text-white' :
                'bg-blue-500 text-white'
              }`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Balance: {parseFloat(balance).toFixed(4)} ETH
              </span>
            </div>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {transactionStatus && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p>{transactionStatus}</p>
          </div>
        )}
  
        {/* Manufacturer View */}
        {userRole === 'manufacturer' && (
  <div className="space-y-6">
    {/* Add Retailer Form */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add a Retailer</h2>
      <div className="flex">
        <input
          type="text"
          placeholder="Retailer wallet address"
          value={newRetailerAddress}
          onChange={(e) => setNewRetailerAddress(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={addRetailer}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-r-lg font-medium transition duration-200"
          disabled={loading.transactions}
        >
          {loading.transactions ? 'Processing...' : 'Add Retailer'}
        </button>
      </div>
    </div>

    {/* Create Product Form */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Product</h2>
      <form onSubmit={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Price (ETH)</label>
          <input
            type="number"
            step="0.0001"
            min="0.0001"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium transition duration-200"
            disabled={loading.transactions}
          >
            {loading.transactions ? 'Processing...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>

    {/* Bulk Shipments Section */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Bulk Shipments to Retailer</h2>
      {pendingRetailerOrders.length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No pending shipments</p>
      ) : (
        <div className="space-y-4">
          {pendingRetailerOrders.map((order) => (
            <div key={order.orderId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                  <p className="text-gray-600">
                    {order.productName} × {order.quantity}
                  </p>
                  <p className="text-sm mt-1">
                    Retailer: {order.retailer.substring(0, 6)}...{order.retailer.substring(38)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mt-1">
                    Ordered: {order.orderDate}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => updateManufacturerShipment(
                    order.orderId,
                    "In Transit",
                    "Manufacturer Warehouse"
                  )}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                  disabled={loading.transactions || order.status === 1}
                >
                  {loading.transactions ? 'Updating...' : 'Mark as In Transit'}
                </button>

                <button
                  onClick={() => updateManufacturerShipment(
                    order.orderId,
                    "DELIVERED",
                    "Retailer Store"
                  )}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                  disabled={loading.transactions || order.status === 2}
                >
                  {loading.transactions ? 'Processing...' : 'Mark as Delivered'}
                </button>

                <button
                  onClick={() => {
                    setTrackedOrder(order);
                    loadManufacturerUpdates(order.orderId);
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                >
                  Track Order
                </button>
              </div>

              {trackedOrder?.orderId === order.orderId && productUpdates.length > 0 && (
                <div className="mt-4 pl-4 border-l-4 border-blue-200">
                  <h4 className="font-bold text-gray-700 mb-2">Shipment Progress</h4>
                  {productUpdates.map((update, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">
                          {update.status === "IN_TRANSIT" ? "In Transit" : 
                           update.status === "DELIVERED" ? "Delivered" : update.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Location: {update.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated by: {`${update.updatedBy.substring(0, 6)}...${update.updatedBy.substring(38)}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Products Table */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Products</h2>
      {products.filter(p => p.manufacturer.toLowerCase() === account.toLowerCase()).length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No products created yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.filter(p => p.manufacturer.toLowerCase() === account.toLowerCase()).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Retailers Table */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Retailer</h2>
      {retailers.length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No retailer added yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {retailers.map((retailer, index) => (
                <tr key={retailer} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {retailer.substring(0, 6)}...{retailer.substring(38)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => viewRetailerInventory(retailer)}
                      className="bg-blue-500 text-white hover:bg-blue-700 font-medium px-4 py-2 rounded"
                    >
                      View Inventory
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}
        
        {/* Retailer View */}
        {userRole === 'retailer' && (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Retailer Dashboard</h2>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'incoming'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Incoming Shipments
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Customer Orders
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inventory
          </button>
        </nav>
      </div>

      {activeTab === 'incoming' && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Incoming from Manufacturer</h3>
          {loading.retailerOrders ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">Loading shipments...</span>
            </div>
          ) : retailerOrders.filter(o => o.status !== 2).length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No incoming shipments</p>
          ) : (
            <div className="space-y-4">
              {retailerOrders
                .filter(order => order.status !== 2)
                .map((order, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                        <p className="text-gray-600">
                          {order.productName} × {order.quantity}
                        </p>
                        <p className="text-sm mt-1">
                          Total: {order.totalPrice} ETH
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mt-1">
                          Ordered: {order.orderDate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTrackedOrder(order);
                        loadManufacturerUpdates(order.orderId);
                      }}
                      className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                    >
                      Track Order
                    </button>

                    {trackedOrder?.orderId === order.orderId && productUpdates.length > 0 && (
                      <div className="mt-4 pl-4 border-l-4 border-blue-200">
                        <h4 className="font-bold text-gray-700 mb-2">Shipment Progress</h4>
                        {productUpdates.map((update, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-800">
                                {update.status === "IN_TRANSIT" ? "In Transit" : 
                                 update.status === "DELIVERED" ? "Delivered" : update.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(update.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Location: {update.location}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Updated by: {`${update.updatedBy.substring(0, 6)}...${update.updatedBy.substring(38)}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Orders</h3>
          {loading.customerOrders ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          ) : customerOrders.filter(order => 
            order.retailer && 
            order.retailer.toLowerCase() === account.toLowerCase()
          ).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No customer orders found for your store</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOrders
                .filter(order => 
                  order.retailer && 
                  order.retailer.toLowerCase() === account.toLowerCase()
                )
                .map((order, index) => (
                  <div key={order.orderId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                        <p className="text-gray-600">
                          {order.productName} × {order.quantity}
                        </p>
                        <p className="text-sm mt-1">
                          Customer: {order.customer.substring(0, 6)}...{order.customer.substring(38)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mt-1">
                          Ordered: {order.orderDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium">Shipping Address:</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                    </div>

                    <button
                      onClick={() => {
                        setTrackedOrder(order);
                        loadRetailerUpdates(order.orderId);
                      }}
                      className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                    >
                      Track Order
                    </button>

                    {trackedOrder?.orderId === order.orderId && (
                      <RetailerTimeline 
                        updates={productUpdates}
                        shippingAddress={order.shippingAddress} 
                        customerAddress={order.customer}
                        retailerAddress={account}
                        order={trackedOrder}
                      />
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => updateRetailerShipment(
                          order.orderId,
                          "PACKED",
                          `PKG-${order.orderId}`
                        )}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                        disabled={order.status > 0 || loading.transactions}
                      >
                        Mark as Packed
                      </button>
                      <button
                        onClick={() => updateRetailerShipment(
                          order.orderId,
                          "SHIPPED",
                          `TRK-${order.orderId}`
                        )}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                        disabled={order.status > 1 || loading.transactions}
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => updateRetailerShipment(
                          order.orderId,
                          "DELIVERED",
                          `DLV-${order.orderId}`
                        )}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                        disabled={order.status > 2 || loading.transactions}
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
  
              {activeTab === 'inventory' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Current Inventory</h3>
                    <button 
                      onClick={async () => {
                        const freshInventory = {};
                        for (const product of products) {
                          const quantity = await contract.getRetailerInventory(account, product.id);
                          freshInventory[product.id] = quantity.toNumber();
                        }
                        setRetailerInventory(freshInventory);
                      }}
                      className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded font-medium transition duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
  
                  {loading.products ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                      <span className="ml-3 text-gray-600">Loading inventory...</span>
                    </div>
                  ) : (
                    <SharedInventoryTable 
                      inventoryData={retailerInventory} 
                      products={products} 
                    />
                  )}
  
                  {/* Place Bulk Order Section */}
                  <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Place Bulk Order to Manufacturer</h2>
                    <form onSubmit={placeRetailerOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Product</label>
                        <select
                          value={retailerOrderData.productId}
                          onChange={(e) => {
                            const selected = products.find(p => p.id === parseInt(e.target.value));
                            setRetailerOrderData({
                              ...retailerOrderData,
                              productId: e.target.value,
                              totalPrice: selected ? (parseFloat(selected.price) * retailerOrderData.quantity).toFixed(6) : '0'
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        >
                          <option value="">Select a product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.price} ETH)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          max={
                            orderData.retailer && orderData.productId 
                              ? retailerInventory[orderData.retailer]?.[orderData.productId] || 1 
                              : 1
                          }
                          value={retailerOrderData.quantity}
                          onChange={(e) => {
                            const selectedProductId = parseInt(orderData.productId);
                            const selectedRetailer = orderData.retailer;
                            
                            // Get available quantity from inventory
                            const availableQty = selectedRetailer && selectedProductId 
                              ? retailerInventory[selectedRetailer]?.[selectedProductId] || 0
                              : 0;
                        
                            const inputQty = parseInt(e.target.value) || 0;
                            const qty = Math.max(1, Math.min(inputQty, availableQty));
                            
                            const selected = products.find(p => p.id === selectedProductId);
                            if (selected) {
                              const priceWei = ethers.utils.parseEther(selected.price);
                              const retailPriceWei = priceWei.mul(120).div(100);
                              const totalPriceWei = retailPriceWei.mul(qty);
                              const displayPrice = ethers.utils.formatEther(totalPriceWei);
                              
                              setOrderData({
                                ...orderData,
                                quantity: qty,
                                totalPrice: displayPrice
                            });
                          }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                          disabled={!orderData.productId}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Total Cost</label>
                        <div className="p-3 bg-gray-100 rounded font-medium">
                          {retailerOrderData.totalPrice} ETH
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium transition duration-200"
                        disabled={loading.transactions || !retailerOrderData.productId}
                      >
                        {loading.transactions ? 'Processing...' : 'Place Bulk Order'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
  
        {/* Customer View */}
        {userRole === 'customer' && (
  <div className="space-y-6">
    {/* Available Products */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Available Products</h2>
      {loading.products ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      ) : errors.products ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{errors.products}</p>
          <button
            onClick={() => loadProducts(contract)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium transition duration-200"
          >
            Retry Loading Products
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Manufacturer Price:</span> {product.price} ETH
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">ID: {product.id}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Available at retailer:</h4>
                {retailers.filter(retailer => {
                  const inventory = retailerInventory[retailer]?.[product.id] || 0;
                  return inventory > 0;
                }).length > 0 ? (
                  retailers.filter(retailer => {
                    const inventory = retailerInventory[retailer]?.[product.id] || 0;
                    return inventory > 0;
                  }).map(retailer => {
                    const inventory = retailerInventory[retailer]?.[product.id] || 0;
                    return (
                      <div key={retailer} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {retailer.substring(0, 6)}...{retailer.substring(38)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty Available: {inventory}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Price: {(parseFloat(product.price) * 1.2).toFixed(6)} ETH
                          </p>
                          <button
                            onClick={() => {
                              setOrderData({
                                productId: product.id.toString(),
                                quantity: 1,
                                shippingAddress: '',
                                totalPrice: (parseFloat(product.price) * 1.2 * 1).toFixed(6),
                                retailer: retailer
                              });
                            }}
                            className="mt-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                            disabled={inventory === 0}
                          >
                            {inventory === 0 ? 'Out of Stock' : 'Order Now'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 py-2">Currently out of stock at the retailer</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Place Order Form */}
    <div id="order-form" className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Place New Order</h2>
      <form onSubmit={placeOrder}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Selected Product</label>
          <input
            type="text"
            value={orderData.productId ?
              `ID: ${orderData.productId} - ${products.find(p => p.id === parseInt(orderData.productId))?.name || 'Unknown'}` :
              'None selected'}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Retailer</label>
          <input
            type="text"
            value={orderData.retailer || 'None selected'}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2"> Quantity (Available: {orderData.retailer && orderData.productId 
      ? retailerInventory[orderData.retailer]?.[orderData.productId] || 0 
      : 0})</label>
          <input
            type="number"
            min="1"
            max={orderData.retailer && orderData.productId 
              ? retailerInventory[orderData.retailer]?.[orderData.productId] || 0 
              : 0}
            value={orderData.quantity}
            onChange={(e) => {
              const selectedProductId = parseInt(orderData.productId);
              const selectedRetailer = orderData.retailer;
              
              const availableQty = selectedRetailer && selectedProductId 
                ? retailerInventory[selectedRetailer]?.[selectedProductId] || 0
                : 0;

              const inputQty = parseInt(e.target.value) || 0;
              const qty = Math.max(1, Math.min(inputQty, availableQty));
              
              const selected = products.find(p => p.id === selectedProductId);
              if (selected) {
                const priceWei = ethers.utils.parseEther(selected.price);
                const retailPriceWei = priceWei.mul(120).div(100);
                const totalPriceWei = retailPriceWei.mul(qty);
                const displayPrice = ethers.utils.formatEther(totalPriceWei);
                
                setOrderData({
                  ...orderData,
                  quantity: qty,
                  totalPrice: displayPrice
                });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={!orderData.productId}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Total Price</label>
          <input
            type="text"
            value={`${orderData.totalPrice} ETH`}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Shipping Address</label>
          <textarea
            name="shippingAddress"
            value={orderData.shippingAddress}
            onChange={(e) => setOrderData({...orderData, shippingAddress: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows="3"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-medium transition duration-200"
          disabled={loading.transactions || !orderData.productId || !orderData.shippingAddress || !orderData.retailer}
        >
          {loading.transactions ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              Processing...
            </span>
          ) : `Place Order (${orderData.totalPrice} ETH)`}
        </button>
      </form>
    </div>

    {/* Customer Orders */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">My Orders</h2>
      {loading.customerOrders ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading your orders...</span>
        </div>
      ) : errors.customerOrders ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{errors.customerOrders}</p>
          <button
            onClick={() => loadCustomerOrders(contract, account)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium transition duration-200"
          >
            Retry Loading Orders
          </button>
        </div>
      ) : customerOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {customerOrders.map(order => (
            <div key={order.orderId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                  <p className="text-gray-600">
                    {order.productName} (Qty: {order.quantity})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Ordered on: {order.orderDate}
                  </p>
                  <p className="text-sm font-medium">
                    Total: {order.totalPrice} ETH
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setTrackedOrder(order);
                  loadRetailerUpdates(order.orderId);
                }}
                className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
              >
                Track Shipment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
  
        {/* Tracking Modal */}
        {trackedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {`Order #${trackedOrder.orderId} Tracking`}
                  </h2>
                  <button
                    onClick={() => {
                      setTrackedOrder(null);
                      setProductUpdates([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
  
                {productUpdates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tracking information available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userRole === 'manufacturer' || (userRole === 'retailer' && activeTab === 'incoming') ? (
                      <ManufacturerTimeline updates={productUpdates} />
                    ) : (
                      <RetailerTimeline 
                        updates={productUpdates}
                        shippingAddress={trackedOrder.shippingAddress} 
                        customerAddress={trackedOrder.customer}
                        retailerAddress={trackedOrder.retailer || account}
                        order={trackedOrder}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

{showInventoryModal && selectedRetailer && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Inventory for {selectedRetailer.substring(0, 6)}...{selectedRetailer.substring(38)}
        </h2>
        <button 
          onClick={() => setShowInventoryModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {/* Use your existing table styling */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => {
              const qty = retailerInventory[selectedRetailer]?.[product.id] || 0;
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qty} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      qty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {qty > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}

export default App;                         
