export const RISKING_ABI = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subscriptionId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_coordinatorAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "have",
        type: "address",
      },
      {
        internalType: "address",
        name: "want",
        type: "address",
      },
    ],
    name: "OnlyCoordinatorCanFulfill",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nftId",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "nftAmount",
            type: "uint128",
          },
        ],
        indexed: false,
        internalType: "struct Risking.NftToken[]",
        name: "nftTokens",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
    ],
    name: "AssetClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "participant",
        type: "address",
      },
    ],
    name: "CancelParticipant",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nftId",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "nftAmount",
            type: "uint128",
          },
        ],
        indexed: false,
        internalType: "struct Risking.NftToken[]",
        name: "nftTokens",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
    ],
    name: "NewAssetDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "participant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nftAmounts",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
    ],
    name: "NewParticipant",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nftAmounts",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
    ],
    name: "NewRiskRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "randomNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "normalizedRandomNumber",
        type: "uint256",
      },
    ],
    name: "RandomNumberCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "player",
        type: "uint256",
      },
    ],
    name: "RiskAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "author",
        type: "address",
      },
    ],
    name: "RiskCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "RiskFinished",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_riskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_userId",
        type: "uint256",
      },
    ],
    name: "acceptRisk",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_riskId",
        type: "uint256",
      },
    ],
    name: "cancelOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_riskId",
        type: "uint256",
      },
    ],
    name: "cancelRisk",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "chainlinkInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "riskingId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "chainlinkRiskingSubscriptionId",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tempId",
        type: "uint256",
      },
    ],
    name: "claimAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_riskId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tempId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "createOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tempId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "createRisk",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_nftAddresses",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_nftIds",
        type: "uint256[]",
      },
      {
        internalType: "uint128[]",
        name: "_nftAmounts",
        type: "uint128[]",
      },
    ],
    name: "depositAsset",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllRisks",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "registeredTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endedTime",
            type: "uint256",
          },
          {
            internalType: "enum Risking.RiskState",
            name: "state",
            type: "uint8",
          },
          {
            components: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "etherValue",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "nftId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint128",
                    name: "nftAmount",
                    type: "uint128",
                  },
                ],
                internalType: "struct Risking.NftToken[]",
                name: "nftTokens",
                type: "tuple[]",
              },
            ],
            internalType: "struct Risking.Participant[]",
            name: "participants",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "playerId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "randomNumber",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "nomalizedRandomNumber",
                type: "uint256",
              },
            ],
            internalType: "struct Risking.RandomResult",
            name: "randomResult",
            type: "tuple",
          },
        ],
        internalType: "struct Risking.Risk[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllTemps",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "enum Risking.RiskTempState",
            name: "state",
            type: "uint8",
          },
          {
            components: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "etherValue",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "nftId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint128",
                    name: "nftAmount",
                    type: "uint128",
                  },
                ],
                internalType: "struct Risking.NftToken[]",
                name: "nftTokens",
                type: "tuple[]",
              },
            ],
            internalType: "struct Risking.Participant",
            name: "deposit",
            type: "tuple",
          },
        ],
        internalType: "struct Risking.RiskTemp[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_riskId",
        type: "uint256",
      },
    ],
    name: "getRiskById",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "author",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "registeredTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endedTime",
            type: "uint256",
          },
          {
            internalType: "enum Risking.RiskState",
            name: "state",
            type: "uint8",
          },
          {
            components: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "etherValue",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "nftId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint128",
                    name: "nftAmount",
                    type: "uint128",
                  },
                ],
                internalType: "struct Risking.NftToken[]",
                name: "nftTokens",
                type: "tuple[]",
              },
            ],
            internalType: "struct Risking.Participant[]",
            name: "participants",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "playerId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "randomNumber",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "nomalizedRandomNumber",
                type: "uint256",
              },
            ],
            internalType: "struct Risking.RandomResult",
            name: "randomResult",
            type: "tuple",
          },
        ],
        internalType: "struct Risking.Risk",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tempId",
        type: "uint256",
      },
    ],
    name: "getTempById",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "enum Risking.RiskTempState",
            name: "state",
            type: "uint8",
          },
          {
            components: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "etherValue",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "nftId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint128",
                    name: "nftAmount",
                    type: "uint128",
                  },
                ],
                internalType: "struct Risking.NftToken[]",
                name: "nftTokens",
                type: "tuple[]",
              },
            ],
            internalType: "struct Risking.Participant",
            name: "deposit",
            type: "tuple",
          },
        ],
        internalType: "struct Risking.RiskTemp",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "randomWords",
        type: "uint256[]",
      },
    ],
    name: "rawFulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_callbackGasLimit",
        type: "uint32",
      },
    ],
    name: "setMaxGasLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const NEWASSETDEPOSITED_EVENT = {
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: "uint256",
      name: "id",
      type: "uint256",
    },
    {
      indexed: false,
      internalType: "address",
      name: "depositor",
      type: "address",
    },
    {
      components: [
        {
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "nftId",
          type: "uint256",
        },
        {
          internalType: "uint128",
          name: "nftAmount",
          type: "uint128",
        },
      ],
      indexed: false,
      internalType: "struct Risking.NftToken[]",
      name: "nftTokens",
      type: "tuple[]",
    },
    {
      indexed: false,
      internalType: "uint256",
      name: "etherValue",
      type: "uint256",
    },
  ],
  name: "NewAssetDeposited",
  type: "event",
};

export const ERC721_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
