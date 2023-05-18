import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNotJoinedCommunities } from '../../apiHelper/community'
import { COMMUNITY_LIMIT } from '../../utils/config'
import CommunityInfoCardLoader from '../Common/UI/Loaders/CommunityInfoCardLoader'
import MobileLoader from '../Common/UI/MobileLoader'
import ExploreCommunityCard from '../Community/ExploreCommunityCard'
import ExploreFeedNav from './ExploreFeedNav'
import { useDevice } from '../Common/DeviceWrapper'
import { useProfile } from '../Common/WalletContext'
import ExploreLensCommunityCard from '../Community/ExploreLensCommunityCard'

const ExploreNewUnjoinedCommunitiesPage = ({
  showUnjoined,
  setShowUnjoined
}) => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { isMobile } = useDevice()
  const { allLensCommunities } = useProfile()

  useEffect(() => {
    getNewNotJoinedCommunities()
  }, [])

  const getNewNotJoinedCommunities = async () => {
    if (!hasMore) return
    const fetchedCommunities = await getNotJoinedCommunities(
      COMMUNITY_LIMIT,
      communities.length
    )
    const newCommunities = fetchedCommunities.communities

    // add lens communities to the top
    let initialDate = new Date()
    let endDate = new Date(newCommunities[newCommunities.length - 1].createdAt)

    if (communities.length !== 0) {
      initialDate = communities[0].membersCount
    }

    let lensCommunities = []

    for (const c of allLensCommunities) {
      if (
        new Date(c.createdAt) < initialDate &&
        new Date(c.createdAt) > endDate &&
        !c.isFollowedByMe
      ) {
        lensCommunities.push({
          ...c,
          membersCount: c.stats.totalFollowers
        })
      }
    }

    // mix and sort the communities
    const mixedCommunities = [...lensCommunities, ...newCommunities]
    mixedCommunities.sort((a, b) => {
      return Date.parse(a.createdAt) - Date.parse(b.createdAt)
    })

    setCommunities([...communities, ...mixedCommunities])
    if (fetchedCommunities.communities.length < COMMUNITY_LIMIT) {
      setHasMore(false)
    }
  }
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-[800px]">
          <ExploreFeedNav
            showUnjoined={showUnjoined}
            setShowUnjoined={setShowUnjoined}
          />
          <InfiniteScroll
            dataLength={communities.length}
            next={getNewNotJoinedCommunities}
            hasMore={hasMore}
            loader={isMobile ? <MobileLoader /> : <CommunityInfoCardLoader />}
            endMessage={<></>}
          >
            {communities.map((community) => {
              if (community?.handle) {
                return (
                  <ExploreLensCommunityCard
                    key={community?.id}
                    community={community}
                  />
                )
              }
              return (
                <ExploreCommunityCard
                  key={community._id}
                  _community={community}
                />
              )
            })}
          </InfiniteScroll>
        </div>
      </div>
    </>
  )
}

export default ExploreNewUnjoinedCommunitiesPage
