import React, { FC } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllCommunities } from '../../apiHelper/community'
import { COMMUNITY_LIMIT } from '../../utils/config'
import CommunityInfoCardLoader from '../Common/UI/Loaders/CommunityInfoCardLoader'
import MobileLoader from '../Common/UI/MobileLoader'
import ExploreCommunityCard from '../Community/ExploreCommunityCard'
import ExploreFeedNav from './ExploreFeedNav'
import { useDevice } from '../Common/DeviceWrapper'

interface Props {
  showUnjoined: boolean
  setShowUnjoined: any
}

const ExploreNewCommunitesPage: FC<Props> = ({
  showUnjoined,
  setShowUnjoined
}) => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { isMobile } = useDevice()

  useEffect(() => {
    getNewCommunities()
  }, [])

  const getNewCommunities = async () => {
    if (!hasMore) return
    const fetchedCommunities = await getAllCommunities(
      COMMUNITY_LIMIT,
      communities.length
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
          <InfiniteScroll
            dataLength={communities.length}
            next={getNewCommunities}
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
    </>
  )
}

export default ExploreNewCommunitesPage
