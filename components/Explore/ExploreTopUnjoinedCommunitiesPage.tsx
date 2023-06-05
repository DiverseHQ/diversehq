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

const ExploreTopUnjoinedCommunitiesPage = ({
  showUnjoined,
  setShowUnjoined
}) => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { isMobile } = useDevice()
  const { allLensCommunities } = useProfile()

  useEffect(() => {
    getTopNotJoinedCommunities()
  }, [])

  const getTopNotJoinedCommunities = async () => {
    if (!hasMore) return
    const fetchedCommunities = await getNotJoinedCommunities(
      COMMUNITY_LIMIT,
      communities.length,
      'top'
    )

    const newCommunities = fetchedCommunities.communities

    // add lens communities to the top
    let startMembersCount = Number.POSITIVE_INFINITY
    let endMembersCount = newCommunities[newCommunities.length - 1].membersCount

    if (communities.length !== 0) {
      startMembersCount = newCommunities[0].membersCount
    }

    let lensCommunities = []

    console.log('allLensCommunities', allLensCommunities)
    console.log('startMembersCount', startMembersCount)
    console.log('endMembersCount', endMembersCount)

    for (const c of allLensCommunities) {
      if (
        c.stats.totalFollowers < startMembersCount &&
        c.stats.totalFollowers > endMembersCount &&
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
      return b.membersCount - a.membersCount
    })

    console.log('mixedCommunities', mixedCommunities)

    setCommunities([...communities, ...mixedCommunities])
    if (fetchedCommunities.communities.length < COMMUNITY_LIMIT) {
      setHasMore(false)
      return
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
          <div>
            <InfiniteScroll
              dataLength={communities.length}
              next={getTopNotJoinedCommunities}
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
      </div>
    </>
  )
}

export default ExploreTopUnjoinedCommunitiesPage
