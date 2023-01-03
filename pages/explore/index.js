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
          loader={<h3> Loading...</h3>}
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
