import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'
import { RiBarChartFill } from 'react-icons/ri'
import { CgDetailsMore } from 'react-icons/cg'
import { FiInfo } from 'react-icons/fi'
import { config } from '../../lib/sanityClient'
import { useState, useEffect, useCallback } from 'react'

const style = {
  nftContainer: 'rounded-lg overflow-hidden',
  topBar: `bg-[#303339] p-2 rounded-t-lg border-[#151c22] border`,
  topBarContent: `flex items-center`,
  likesCounter: `flex-1 flex items-center justify-end`,
  metadataContainer: 'border-x p-4 bg-white text-black',
  propertyContainer: 'flex justify-start gap-3 m-4 flex-wrap',
  metaTitle: 'font-bold text-ls flex items-center gap-[5px]',
  propertyKey: 'font-bold text-sky-800',
  propertyValue: 'text-sky-700',
  propertyItem:
    'py-2 px-2 bg-sky-100 rounded-md border border border-solid border-sky-300 w-[130px] text-center transition  duration-500 hover:border-solid',
}

const NFTImage = ({ selectedNft, collectionid }) => {
  const [metadata, setMetadata] = useState({ likedBy: [], views: 0, likes: 0 })
  const [collectionData, setCollectionData] = useState('')

  useEffect(() => {
    if (!collectionid || !selectedNft) return //get NFT Items' meta data
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftItem" && contractAddress == "${collectionid}" && id == "0"] {
        views, likedBy, likes
      }`
      const result = await sanityClient.fetch(query)
      setMetadata(result[0])

      //get collection data
      const query2 = `*[_type == "nftCollection" && contractAddress == "${collectionid}"] {
        name, description
      }`
      const result2 = await sanityClient.fetch(query2)

      setCollectionData(result2[0])
    })()
    selectedNft.metadata.properties.traits.map((tr) => {
      console.log(tr.propertyKey + '-' + tr.propertyValue)
    })
  }, [selectedNft, collectionid])

  return (
    <div className={style.nftContainer}>
      <div>
        <img src={selectedNft?.metadata?.image} />
      </div>
      <div className={style.metadataContainer}>
        <h3 className={style.metaTitle}>
          <RiBarChartFill /> Properties
        </h3>
        <div className={style.propertyContainer}>
          {/* {selectedNft?.metadata?.properties?.traits?.map((props, id) => 
            {props.propertyKey != ' ' ? (
              <div className={style.propertyItem} key={id}>
                <p className={style.propertyKey}>{props.propertyKey}</p>
                <p className={style.propertyValue}>{props.propertyValue}</p>
              </div>
            ): (
              <>No properties set</>
            )
            }
          )} */}
        </div>

        {collectionData && (
          <>
            <h3 className={style.metaTitle}>
              <FiInfo /> About {collectionData.name}
            </h3>
            <div
              className={style.propertyContainer}
              style={{ marginTop: '0.3rem' }}
            >
              {collectionData.description}
            </div>
          </>
        )}

        <h3 className={style.metaTitle}>
          <CgDetailsMore />
          NFT Details
        </h3>
        <div
          className={style.propertyContainer}
          style={{ marginTop: '0.3rem' }}
        >
          <div className="flex w-full justify-between">
            <p>Contract Address</p>
            <p>
              {collectionid.slice(0, 4)}..{collectionid.slice(-4)}
            </p>
          </div>
          <div className="mt-0 flex w-full justify-between">
            <p>Token ID</p>
            <p>{selectedNft?.metadata?.id.toString()}</p>
          </div>
          <div className="mt-0 flex w-full justify-between">
            <p>Blockchain</p>
            <p>Polygon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTImage
