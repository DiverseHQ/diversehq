import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNotJoinedCommunities } from '../../api/community'
import { COMMUNITY_LIMIT } from '../../utils/config'
import MobileLoader from '../Common/UI/MobileLoader'
import useDevice from '../Common/useDevice'
import CommunityInfoCard from '../Community/CommunityInfoCard'
import ExploreFeedNav from './ExploreFeedNav'

const ExploreNewUnjoinedCommunitiesPage = ({
  showUnjoined,
  setShowUnjoined
}) => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { isMobile } = useDevice()

  useEffect(() => {
    getNewNotJoinedCommunities()
  }, [])

  const getNewNotJoinedCommunities = async () => {
    if (!hasMore) return
    const fetchedCommunities = await getNotJoinedCommunities(
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
        <div className="w-full md:w-[650px]">
          <ExploreFeedNav
            showUnjoined={showUnjoined}
            setShowUnjoined={setShowUnjoined}
          />
          <InfiniteScroll
            dataLength={communities.length}
            next={getNewNotJoinedCommunities}
            hasMore={hasMore}
            loader={
              isMobile ? (
                <MobileLoader />
              ) : (
                <>
                  <div className="w-full bg-gray-100 dark:bg-s-bg animate-pulse my-4 sm:my-6">
                    <div className="w-full h-[100px] bg-gray-300 dark:bg-p-bg" />
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-28 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-s-bg animate-pulse my-4 sm:my-6">
                    <div className="w-full h-[100px] bg-gray-300 dark:bg-p-bg" />
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-28 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-s-bg animate-pulse my-4 sm:my-6">
                    <div className="w-full h-[100px] bg-gray-300 dark:bg-p-bg" />
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-28 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-s-bg animate-pulse my-4 sm:my-6">
                    <div className="w-full h-[100px] bg-gray-300 dark:bg-p-bg" />
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-32 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                    <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                      <div className="w-20 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                      <div className="w-28 h-4 bg-gray-300 dark:bg-p-bg rounded-full" />
                    </div>
                  </div>
                </>
              )
            }
            endMessage={<></>}
          >
            {communities.map((community) => {
              return (
                <CommunityInfoCard key={community._id} _community={community} />
              )
            })}
          </InfiniteScroll>
        </div>
      </div>
    </>
  )
}

export default ExploreNewUnjoinedCommunitiesPage
