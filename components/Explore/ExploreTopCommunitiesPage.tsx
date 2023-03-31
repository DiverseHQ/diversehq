import React, { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllCommunities } from '../../api/community'
import { COMMUNITY_LIMIT } from '../../utils/config'
import CommunityInfoCardLoader from '../Common/UI/Loaders/CommunityInfoCardLoader'
import MobileLoader from '../Common/UI/MobileLoader'
import useDevice from '../Common/useDevice'
import ExploreCommunityCard from '../Community/ExploreCommunityCard'
import ExploreFeedNav from './ExploreFeedNav'

interface Props {
  showUnjoined: boolean
  setShowUnjoined: any
}

const ExploreTopCommunitiesPage: FC<Props> = ({
  showUnjoined,
  setShowUnjoined
}) => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { isMobile } = useDevice()

  useEffect(() => {
    getTopCommunities()
  }, [])

  const getTopCommunities = async () => {
    if (!hasMore) return
    const fetchedCommunities = await getAllCommunities(
      COMMUNITY_LIMIT,
      communities.length,
      'top'
    )
    setCommunities([...communities, ...fetchedCommunities.communities])
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
          <div>
            <InfiniteScroll
              dataLength={communities.length}
              next={getTopCommunities}
              hasMore={hasMore}
              loader={isMobile ? <MobileLoader /> : <CommunityInfoCardLoader />}
              endMessage={<></>}
            >
              {communities.map((community) => {
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

export default ExploreTopCommunitiesPage
