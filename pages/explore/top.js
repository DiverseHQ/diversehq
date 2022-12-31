import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllCommunities } from '../../api/community'
import CommunityInfoCard from '../../components/Community/CommunityInfoCard'
import ExploreFeedNav from '../../components/Explore/ExploreFeedNav'
import { COMMUNITY_LIMIT } from '../../utils/config'

const top = () => {
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
    <div className="pt-6">
      <div className="w-full flex justify-center">
        <div className="max-w-[650px] shrink-0">
          <ExploreFeedNav />
        </div>
      </div>
      <InfiniteScroll
        dataLength={communities.length}
        next={getTopCommunities}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        {communities.map((community) => {
          return <CommunityInfoCard key={community._id} community={community} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default top
