import { Provider } from "ox";
export declare const provider: {
  request: Provider.RequestFn<
    | {
        Request: {
          method: "eth_accounts";
          params?: undefined;
        };
        ReturnType: readonly import("ox/_types/core/Address").Address[];
      }
    | {
        Request: {
          method: "eth_blobBaseFee";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_blockNumber";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_call";
          params:
            | [transaction: import("ox/_types/core/TransactionRequest").Rpc]
            | [
                transaction: import("ox/_types/core/TransactionRequest").Rpc,
                block:
                  | import("ox/_types/core/Block").Number<
                      import("ox/_types/core/Hex").Hex
                    >
                  | import("ox/_types/core/Block").Tag
                  | import("ox/_types/core/Block").Hash,
              ]
            | [
                transaction: import("ox/_types/core/TransactionRequest").Rpc,
                block:
                  | import("ox/_types/core/Block").Number<
                      import("ox/_types/core/Hex").Hex
                    >
                  | import("ox/_types/core/Block").Tag
                  | import("ox/_types/core/Block").Hash,
                stateOverride: unknown,
              ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_chainId";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_coinbase";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Address").Address;
      }
    | {
        Request: {
          method: "eth_estimateGas";
          params:
            | [transaction: import("ox/_types/core/TransactionRequest").Rpc]
            | [
                transaction: import("ox/_types/core/TransactionRequest").Rpc,
                block:
                  | import("ox/_types/core/Block").Number<
                      import("ox/_types/core/Hex").Hex
                    >
                  | import("ox/_types/core/Block").Tag
                  | import("ox/_types/core/Block").Hash,
              ]
            | [
                transaction: import("ox/_types/core/TransactionRequest").Rpc,
                block:
                  | import("ox/_types/core/Block").Number<
                      import("ox/_types/core/Hex").Hex
                    >
                  | import("ox/_types/core/Block").Tag
                  | import("ox/_types/core/Block").Hash,
                stateOverride: unknown,
              ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_feeHistory";
          params: [
            blockCount: import("ox/_types/core/Hex").Hex,
            newestBlock:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag,
            rewardPercentiles: number[] | undefined,
          ];
        };
        ReturnType: import("ox/_types/core/Fee").FeeHistoryRpc;
      }
    | {
        Request: {
          method: "eth_gasPrice";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getBalance";
          params: [
            address: import("ox/_types/core/Address").Address,
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag
              | import("ox/_types/core/Block").Hash,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getBlockByHash";
          params: [
            hash: import("ox/_types/core/Hex").Hex,
            includeTransactionObjects: boolean,
          ];
        };
        ReturnType: import("ox/_types/core/Block").Rpc | null;
      }
    | {
        Request: {
          method: "eth_getBlockByNumber";
          params: [
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag,
            includeTransactionObjects: boolean,
          ];
        };
        ReturnType: import("ox/_types/core/Block").Rpc | null;
      }
    | {
        Request: {
          method: "eth_getBlockTransactionCountByHash";
          params: [hash: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getBlockTransactionCountByNumber";
          params: [
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getCode";
          params: [
            address: import("ox/_types/core/Address").Address,
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag
              | import("ox/_types/core/Block").Hash,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getFilterChanges";
          params: [filterId: import("ox/_types/core/Hex").Hex];
        };
        ReturnType:
          | readonly import("ox/_types/core/Log").Rpc[]
          | readonly import("ox/_types/core/Hex").Hex[];
      }
    | {
        Request: {
          method: "eth_getFilterLogs";
          params: [filterId: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: readonly import("ox/_types/core/Log").Rpc[];
      }
    | {
        Request: {
          method: "eth_getLogs";
          params: [filter: import("ox/_types/core/Filter").Rpc];
        };
        ReturnType: readonly import("ox/_types/core/Log").Rpc[];
      }
    | {
        Request: {
          method: "eth_getProof";
          params: [
            address: import("ox/_types/core/Address").Address,
            storageKeys: import("ox/_types/core/Hex").Hex[],
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag
              | import("ox/_types/core/Block").Hash,
          ];
        };
        ReturnType: import("ox/_types/core/AccountProof").Rpc;
      }
    | {
        Request: {
          method: "eth_getStorageAt";
          params: [
            address: import("ox/_types/core/Address").Address,
            index: import("ox/_types/core/Hex").Hex,
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag
              | import("ox/_types/core/Block").Hash,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getTransactionByBlockHashAndIndex";
          params: [
            hash: import("ox/_types/core/Hex").Hex,
            index: import("ox/_types/core/Hex").Hex,
          ];
        };
        ReturnType: import("ox/_types/core/Transaction").Rpc | null;
      }
    | {
        Request: {
          method: "eth_getTransactionByBlockNumberAndIndex";
          params: [
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag,
            index: import("ox/_types/core/Hex").Hex,
          ];
        };
        ReturnType: import("ox/_types/core/Transaction").Rpc | null;
      }
    | {
        Request: {
          method: "eth_getTransactionByHash";
          params: [hash: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: import("ox/_types/core/Transaction").Rpc | null;
      }
    | {
        Request: {
          method: "eth_getTransactionCount";
          params: [
            address: import("ox/_types/core/Address").Address,
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag
              | import("ox/_types/core/Block").Hash,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getTransactionReceipt";
          params: [hash: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: import("ox/_types/core/TransactionReceipt").Rpc | null;
      }
    | {
        Request: {
          method: "eth_getUncleCountByBlockHash";
          params: [hash: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_getUncleCountByBlockNumber";
          params: [
            block:
              | import("ox/_types/core/Block").Number<
                  import("ox/_types/core/Hex").Hex
                >
              | import("ox/_types/core/Block").Tag,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_maxPriorityFeePerGas";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_newBlockFilter";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_newFilter";
          params: [filter: import("ox/_types/core/Filter").Rpc];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_newPendingTransactionFilter";
          params?: undefined;
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_protocolVersion";
          params?: undefined;
        };
        ReturnType: string;
      }
    | {
        Request: {
          method: "eth_requestAccounts";
          params?: undefined;
        };
        ReturnType: readonly import("ox/_types/core/Address").Address[];
      }
    | {
        Request: {
          method: "eth_sendRawTransaction";
          params: [serializedTransaction: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_sendTransaction";
          params: [
            transaction: import("ox/_types/core/TransactionRequest").Rpc,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_signTransaction";
          params: [request: import("ox/_types/core/TransactionRequest").Rpc];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_signTypedData_v4";
          params: [
            address: import("ox/_types/core/Address").Address,
            message: string,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_uninstallFilter";
          params: [filterId: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: boolean;
      }
    | {
        Request: {
          method: "eth_requestAccounts";
          params?: undefined;
        };
        ReturnType: readonly import("ox/_types/core/Address").Address[];
      }
    | {
        Request: {
          method: "eth_sendRawTransaction";
          params: [serializedTransaction: import("ox/_types/core/Hex").Hex];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_sendTransaction";
          params: [
            transaction: import("ox/_types/core/TransactionRequest").Rpc,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_signTransaction";
          params: [request: import("ox/_types/core/TransactionRequest").Rpc];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "eth_signTypedData_v4";
          params: [
            address: import("ox/_types/core/Address").Address,
            message: string,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "personal_sign";
          params: [
            data: import("ox/_types/core/Hex").Hex,
            address: import("ox/_types/core/Address").Address,
          ];
        };
        ReturnType: import("ox/_types/core/Hex").Hex;
      }
    | {
        Request: {
          method: "wallet_addEthereumChain";
          params: [
            chain: import("ox/_types/core/internal/types").Compute<{
              chainId: string;
              chainName: string;
              nativeCurrency?:
                | {
                    name: string;
                    symbol: string;
                    decimals: number;
                  }
                | undefined;
              rpcUrls: readonly string[];
              blockExplorerUrls?: readonly string[] | undefined;
              iconUrls?: readonly string[] | undefined;
            }>,
          ];
        };
        ReturnType: null;
      }
    | {
        Request: {
          method: "wallet_getCallsStatus";
          params?: [string];
        };
        ReturnType: import("ox/_types/core/internal/types").Compute<{
          status: "PENDING" | "CONFIRMED";
          receipts?:
            | readonly {
                logs: {
                  address: import("ox/_types/core/Hex").Hex;
                  data: import("ox/_types/core/Hex").Hex;
                  topics: readonly import("ox/_types/core/Hex").Hex[];
                }[];
                status: import("ox/_types/core/Hex").Hex;
                blockHash: import("ox/_types/core/Hex").Hex;
                blockNumber: import("ox/_types/core/Hex").Hex;
                gasUsed: import("ox/_types/core/Hex").Hex;
                transactionHash: import("ox/_types/core/Hex").Hex;
              }[]
            | undefined;
        }>;
      }
    | {
        Request: {
          method: "wallet_getCapabilities";
          params?: [import("ox/_types/core/Address").Address];
        };
        ReturnType: import("ox/_types/core/internal/types").Compute<{
          [chainId: `0x${string}`]: {
            [capability: string]: any;
          };
        }>;
      }
    | {
        Request: {
          method: "wallet_getPermissions";
          params?: undefined;
        };
        ReturnType: readonly import("ox/_types/core/internal/types").Compute<{
          caveats: readonly {
            type: string;
            value: any;
          }[];
          date: number;
          id: string;
          invoker: `http://${string}` | `https://${string}`;
          parentCapability: "eth_accounts" | string;
        }>[];
      }
    | {
        Request: {
          method: "wallet_grantPermissions";
          params?: [
            {
              signer?:
                | {
                    type: string;
                    data?: unknown | undefined;
                  }
                | undefined;
              permissions: readonly {
                data: unknown;
                policies: readonly {
                  data: unknown;
                  type: string;
                }[];
                required?: boolean | undefined;
                type: string;
              }[];
              expiry: number;
            },
          ];
        };
        ReturnType: import("ox/_types/core/internal/types").Compute<{
          expiry: number;
          factory?: `0x${string}` | undefined;
          factoryData?: string | undefined;
          grantedPermissions: readonly {
            data: unknown;
            policies: readonly {
              data: unknown;
              type: string;
            }[];
            required?: boolean | undefined;
            type: string;
          }[];
          permissionsContext: string;
          signerData?:
            | {
                userOpBuilder?: `0x${string}` | undefined;
                submitToAddress?: `0x${string}` | undefined;
              }
            | undefined;
        }>;
      }
    | {
        Request: {
          method: "wallet_requestPermissions";
          params: [
            permissions: {
              eth_accounts: Record<string, any>;
            },
          ];
        };
        ReturnType: readonly import("ox/_types/core/internal/types").Compute<{
          caveats: readonly {
            type: string;
            value: any;
          }[];
          date: number;
          id: string;
          invoker: `http://${string}` | `https://${string}`;
          parentCapability: "eth_accounts" | string;
        }>[];
      }
    | {
        Request: {
          method: "wallet_revokePermissions";
          params: [
            permissions: {
              eth_accounts: Record<string, any>;
            },
          ];
        };
        ReturnType: null;
      }
    | {
        Request: {
          method: "wallet_sendCalls";
          params: import("ox/_types/core/internal/types").Compute<
            [
              {
                calls: readonly {
                  to?: import("ox/_types/core/Address").Address | undefined;
                  data?: import("ox/_types/core/Hex").Hex | undefined;
                  value?: import("ox/_types/core/Hex").Hex | undefined;
                }[];
                capabilities?:
                  | {
                      [capability: string]: any;
                    }
                  | undefined;
                chainId?: import("ox/_types/core/Hex").Hex | undefined;
                from: import("ox/_types/core/Address").Address;
                version: string;
              },
            ]
          >;
        };
        ReturnType: string;
      }
    | {
        Request: {
          method: "wallet_showCallsStatus";
          params: [string];
        };
        ReturnType: undefined;
      }
    | {
        Request: {
          method: "wallet_switchEthereumChain";
          params: [
            chain: {
              chainId: string;
            },
          ];
        };
        ReturnType: null;
      }
    | {
        Request: {
          method: "wallet_watchAsset";
          params: [
            import("ox/_types/core/internal/types").Compute<{
              type: "ERC20";
              options: {
                address: string;
                symbol: string;
                decimals: number;
                image?: string | undefined;
              };
            }>,
          ];
        };
        ReturnType: boolean;
      }
  >;
  on: Provider.EventListenerFn;
  removeListener: Provider.EventListenerFn;
};
export type ProviderType = typeof provider;
