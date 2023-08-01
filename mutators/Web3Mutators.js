import { ThirdwebSDK } from '@thirdweb-dev/sdk'

export const deployCollection = () => async () => {}

export const updateCollectionMetaData = async (newCollectionData, signer, profile) => {

    const sdk = new ThirdwebSDK(signer, {
        clientId : process.env.NEXT_PUBLIC_THIRDWEB_PRIVATE_KEY,
      })
    const contract = await sdk.getContract(newCollectionData.contractAddress, "nft-collection");

    await contract.metadata.update({
        name: newCollectionData.name,
        description: newCollectionData.description,
        image: profile,
    });
}

export const updatePayment = async (collectionContract, basisPoints, recipient) => {

    await collectionContract.royalties.setDefaultRoyaltyInfo({
        seller_fee_basis_points: basisPoints * 100,
        fee_recipient: recipient
    })
}