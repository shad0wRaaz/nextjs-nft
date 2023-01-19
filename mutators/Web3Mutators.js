import { ThirdwebSDK } from '@thirdweb-dev/sdk'

export const deployCollection = () => async () => {}

export const updateCollectionMetaData = async (newCollectionData, signer, profile) => {

    const sdk = new ThirdwebSDK(signer)
    const contract = await sdk.getContract(newCollectionData.contractAddress, "nft-collection");

    await contract.metadata.update({
        name: newCollectionData.name,
        description: newCollectionData.description,
        image: profile,
    });
}

export const updatePayment = async (collection, signer, basisPoints, recipient) => {
    
    const sdk = new ThirdwebSDK(signer);
    const contract = await sdk.getContract(collection[0].contractAddress, "nft-collection");

    await contract.royalties.setDefaultRoyaltyInfo({
        seller_fee_basis_points: basisPoints * 100,
        fee_recipient: recipient
    })
}