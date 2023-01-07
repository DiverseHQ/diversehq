import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllCommunities } from '../../api/community'
import CommunityInfoCard from '../../components/Community/CommunityInfoCard'
import ExploreFeedNav from '../../components/Explore/ExploreFeedNav'
import { COMMUNITY_LIMIT } from '../../utils/config'

const index = () => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)

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
      <NextSeo
        title="Explore"
        description="Connect, learn, and grow with like-minded individuals in our Explore Communities."
        canonical={window.location.href}
        openGraph={{
          url: window.location.href,
          title: 'Explore',
          description:
            'Connect, learn, and grow with like-minded individuals in our Explore Communities.',
          site_name: 'DiverseHQ'
        }}
      />
      <div className="w-full flex justify-center shrink-0 pt-6">
        <div className="w-full md:w-[650px]">
          <ExploreFeedNav />
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
          endMessage={
            <div className="w-full flex flex-row items-center text-center justify-center py-4 text-s-text text-sm">
              --- You have reached the end ---
            </div>
          }
        >
          {communities.map((community) => {
            return (
              <CommunityInfoCard key={community._id} community={community} />
            )
          })}
        </InfiniteScroll>
      </div>
    </>
  )
}

export default index
