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
      <ExploreFeedNav />
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

export default index