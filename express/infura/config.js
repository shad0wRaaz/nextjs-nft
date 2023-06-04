import { SDK, Auth, TEMPLATES, Metadata } from '@infura/sdk';

export const INFURA_AUTH = Buffer.from(process.env.NEXT_PUBLIC_INFURA_API_KEY + ':' + process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,).toString('base64');

// const INFURA_SDK_AUTH_POLYGON = new Auth({
//     projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     secretId: process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,
//     privateKey: process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
//     rpcUrl: process.env.NEXT_PUBLIC_INFURA_POLYGON_RPC_URL + process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     chainId: 137,
// });
// const INFURA_SDK_AUTH_MUMBAI = new Auth({
//     projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     secretId: process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,
//     privateKey: process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
//     rpcUrl: process.env.NEXT_PUBLIC_INFURA_MUMBAI_RPC_URL + process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     chainId: 80001,
// });
// const INFURA_SDK_AUTH_BINANCE = new Auth({
//     projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     secretId: process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,
//     privateKey: process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
//     rpcUrl: process.env.NEXT_PUBLIC_INFURA_BINANCE_SMARTCHAIN_RPC_URL + process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     chainId: 56,
// });
// const INFURA_SDK_AUTH_BINANCE_TESTNET = new Auth({
//     projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     secretId: process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,
//     privateKey: process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
//     rpcUrl: process.env.NEXT_PUBLIC_INFURA_BINANCE_TESTNET_RPC_URL + process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     chainId: 97,
// });
// const INFURA_SDK_AUTH_AVALANCHE = new Auth({
//     projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     secretId: process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,
//     privateKey: process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
//     rpcUrl: process.env.NEXT_PUBLIC_INFURA_AVALANCHE_RPC_URL + process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     chainId: 43114,
// });
// const INFURA_SDK_AUTH_ETHEREUM = new Auth({
//     projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     secretId: process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,
//     privateKey: process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
//     rpcUrl: process.env.NEXT_PUBLIC_INFURA_ETHEREUM_RPC_URL + process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     chainId: 1,
// });
// const INFURA_SDK_AUTH_GOERLI = new Auth({
//     projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     secretId: process.env.NEXT_PUBLIC_INFURA_SECRET_KEY,
//     privateKey: process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
//     rpcUrl: process.env.NEXT_PUBLIC_INFURA_GOERLI_RPC_URL + process.env.NEXT_PUBLIC_INFURA_API_KEY,
//     chainId: 5,
// });

// const AUTH_OBJS = {
//     '1': INFURA_SDK_AUTH_ETHEREUM,
//     '5': INFURA_SDK_AUTH_GOERLI,
//     '56': INFURA_SDK_AUTH_BINANCE,
//     '97': INFURA_SDK_AUTH_BINANCE_TESTNET,
//     '137': INFURA_SDK_AUTH_POLYGON,
//     '80001': INFURA_SDK_AUTH_MUMBAI,
//     '43114': INFURA_SDK_AUTH_AVALANCHE,
// }

// const INFURA_SDK_MUMBAI = new SDK(INFURA_SDK_AUTH_MUMBAI);

// export const getCollectionsByWallet = async (chainId, walletAddress) => {
//     const selectedSDK = AUTH_OBJS[chainId];
//     // console.log(await selectedSDK.api)
//     const result = await INFURA_SDK_AUTH_MUMBAI.api.getCollectionsByWallet({
//         walletAddress: walletAddress,
//       });
//     //   console.log('collections:', result);
//     return result;
// }