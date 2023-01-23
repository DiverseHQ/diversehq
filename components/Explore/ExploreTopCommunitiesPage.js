import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllCommunities } from '../../api/community'
import { COMMUNITY_LIMIT } from '../../utils/config'
import useDevice from '../Common/useDevice'
import CommunityInfoCard from '../Community/CommunityInfoCard'
import ExploreFeedNav from './ExploreFeedNav'

const ExploreTopCommunitiesPage = () => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { isDesktop } = useDevice()

  useEffect(() => {
    getTopCommunities()
  }, [])

  const getTopCommunities = async () => {
    console.log('getTopCommunities')
    if (!hasMore) return
    const fetchedCommunities = await getAllCommunities(
      COMMUNITY_LIMIT,
      communities.length,
      'top'
    )
    setCommunities([...communities, ...fetchedCommunities.communities])
    console.log('fetched communities from top')
    if (fetchedCommunities.communities.length < COMMUNITY_LIMIT) {
      setHasMore(false)
    }
  }

  return (
    <>
      <div className="w-full flex justify-center shrink-0 pt-6">
        <div className="w-full md:w-[650px]">
          {isDesktop && <ExploreFeedNav />}
        </div>
      </div>
      <div>
        <InfiniteScroll
          dataLength={communities.length}
          next={getTopCommunities}
          hasMore={hasMore}
          loader={
            <>
              <div className="w-full bg-gray-100 animate-pulse my-4 sm:my-6">
                <div className="w-full h-[100px] bg-gray-300" />
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                  <div className="w-28 h-4 bg-gray-300 rounded-full" />
                </div>
              </div>
              <div className="w-full bg-gray-100 animate-pulse my-4 sm:my-6">
                <div className="w-full h-[100px] bg-gray-300" />
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                  <div className="w-28 h-4 bg-gray-300 rounded-full" />
                </div>
              </div>
              <div className="w-full bg-gray-100 animate-pulse my-4 sm:my-6">
                <div className="w-full h-[100px] bg-gray-300" />
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                  <div className="w-28 h-4 bg-gray-300 rounded-full" />
                </div>
              </div>
              <div className="w-full bg-gray-100 animate-pulse my-4 sm:my-6">
                <div className="w-full h-[100px] bg-gray-300" />
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-32 h-4 bg-gray-300 rounded-full" />
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
                  <div className="w-20 h-4 bg-gray-300 rounded-full" />
                  <div className="w-28 h-4 bg-gray-300 rounded-full" />
                </div>
              </div>
            </>
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
    </>
  )
}

export default ExploreTopCommunitiesPage
