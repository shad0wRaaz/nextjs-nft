import Link from 'next/link'
import Loader from './Loader'
import { useQuery } from 'react-query'
import { toast } from 'react-hot-toast'
import CollectionCard from './CollectionCard'
import { getUnsignedImagePath } from '../fetchers/s3'
import { useThemeContext } from '../contexts/ThemeContext'
import { getNFTCollectionsByCategory } from '../fetchers/SanityFetchers'

const errorToastStyle = {
  style: { background: '#ef4444', padding: '16px', color: '#fff' },
  iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
}

const CollectionByCategory = ({ categoryName }) => {
  const { dark } = useThemeContext()
  const { data, status } = useQuery(
    ['collection', categoryName],
    getNFTCollectionsByCategory(),
    {
      onError: () => {
        toast.error(
          'Error fetching data. Refresh and try again.',
          errorToastStyle
        )
      },
    }
  )
  // const { data: updatedData, status: updatedStatus } = useQuery(
  //   ['updatedCollection', categoryName],
  //   async () => {
  //     const unresolved = data.map(async (item) => {
  //       const obj = { ...item }
  //       const profilePath = await getUnsignedImagePath(item.profileImage)
  //       const bannerPath = await getUnsignedImagePath(item.bannerImage)
  //       obj['profileImage'] = profilePath?.data.url
  //       obj['bannerImage'] = bannerPath?.data.url
  //       return obj
  //     })

  //     const resolvedPaths = await Promise.all(unresolved)
  //     return resolvedPaths
  //   },
  //   {
  //     enabled: Boolean(data),
  //     onError: () => {
  //       toast.error(
  //         'Error fetching data. Refresh and try again.',
  //         errorToastStyle
  //       )
  //     },
  //     onSuccess:(res) => {
  //       // console.log(res)
  //     }
  //   }
  // )

  return (
    <div
      className={`grid grid-cols-1 place-items-center  ${
        status === 'loading' ||
        (status === 'success' && data.length == 0)
          ? ' '
          : ' gap-4 sm:grid-cols-2 md:gap-7 lg:grid-cols-3 xl:grid-cols-4'
      }`}
    >
      {status === 'success' &&
        data.length > 0 &&
        data.map((coll, id) => (
          <CollectionCard
            key={id}
            id={coll._id}
            name={coll.name}
            contractAddress={coll.contractAddress}
            profileImage={coll.web3imageprofile}
            bannerImage={coll.web3imagebanner}
            description={coll.description}
            chainId={coll.chainId}
            volumeTraded={coll.volumeTraded}
            floorPrice={coll.floorPrice}
            allOwners={coll.allOwners}
            creator={coll.creator}
            creatorAddress={coll.creatorAddress}
          />
        ))}
      {status === 'success' && data.length == 0 && (
        <div
          className={`mx-auto rounded-xl border ${
            dark ? ' border-sky-400/20' : ' border-neutral-200'
          } p-[4rem] px-[6rem] text-center sm:p-[4rem]`}
        >
          No Collection uploaded yet.
          <Link href="/contracts">
            <p className="gradBlue mt-4 cursor-pointer rounded-xl p-2 px-4 text-white ">
              Create New Collection
            </p>
          </Link>
        </div>
      )}
      {status === 'loading' && <Loader />}
    </div>
  )
}

export default CollectionByCategory
