import React, { useEffect, useState } from 'react'
import {
  IsFollowedLensCommunityType,
  useProfile
} from '../../Common/WalletContext'
import { searchCommunityFromName } from '../../../api/community'
import formatHandle from '../../User/lib/formatHandle'
import getAvatar from '../../User/lib/getAvatar'
import RightSidebarThumnailTypeCommunity from '../../Common/UI/RightSidebarThumnailTypeCommunity'
import getCoverBanner from '../../User/lib/getCoverBanner'
import getIPFSLink from '../../User/lib/getIPFSLink'

const CommunitySearchColumn = ({ q }: { q: string }) => {
  const [communities, setCommunities] = useState([])
  const [lensCommunities, setLensCommunities] = useState<
    IsFollowedLensCommunityType[]
  >([])
  const { allLensCommunities } = useProfile()

  const setCommunitiesOnSearchChange = async () => {
    if (q === '') {
      setCommunities([])
      setLensCommunities([])
      return
    }
    const res = await searchCommunityFromName(q, 10)
    setCommunities(res)

    // get top 5 matching communities from allLensCommunities
    const matchingCommunities = allLensCommunities
      .filter((community) => {
        return formatHandle(community.handle)
          .toLowerCase()
          .includes(q.toLowerCase())
      })
      .slice(0, 3)
    setLensCommunities(matchingCommunities)
  }

  useEffect(() => {
    setCommunitiesOnSearchChange()
  }, [q, allLensCommunities])

  console.log('communities', communities)
  console.log('lensCommunities', lensCommunities)

  return (
    <>
      {communities.length + lensCommunities.length > 0 && (
        <div className="flex flex-col gap-y-4">
          {lensCommunities.map((community) => (
            <RightSidebarThumnailTypeCommunity
              key={community.handle}
              community={{
                // @ts-ignore
                bannerImageUrl: getCoverBanner(community),
                // @ts-ignore
                logoImageUrl: getAvatar(community),
                isLensCommunity: true,
                name: formatHandle(community.handle)
              }}
            />
            // <div
            //   className="m-2 flex flex-row p-1 hover:bg-s-hover underline-offset-4  items-center rounded-full cursor-pointer"
            //   key={community.handle}
            //   onClick={() => {}}
            // >
            //   <ImageWithPulsingLoader
            //     // @ts-ignore
            //     src={getAvatar(community)}
            //     className="w-8 h-8 mr-3 rounded-full object-cover"
            //   />
            //   <div className="text-sm">l/{formatHandle(community.handle)}</div>
            //   {community?.verified && <VerifiedBadge className="ml-1" />}
            // </div>
          ))}

          {communities.map((community) => (
            <RightSidebarThumnailTypeCommunity
              community={{
                bannerImageUrl: community.bannerImageUrl,
                logoImageUrl: getIPFSLink(community.logoImageUrl),
                isLensCommunity: false,
                name: community.name
              }}
              key={community._id}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default CommunitySearchColumn
