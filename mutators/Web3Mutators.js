import { ThirdwebSDK } from '@thirdweb-dev/sdk'

export const deployCollection = () => async () => {}

export const updateCollectionMetaData = async ({newCollectionData, rpcUrl}) => {
     console.log(newCollectionData.contractAddress)
    // const sdk = new ThirdwebSDK('polygon')
    // const contract = await sdk.getContract(newCollectionData.contractAddress)
    // await contract.metadata.set({
    //     name: newCollectionData.name,
    //     description: newCollectionData.description
    // });
}
