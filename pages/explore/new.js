import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllCommunities } from '../../api/community'
import CommunityInfoCard from '../../components/Community/CommunityInfoCard'
import ExploreFeedNav from '../../components/Explore/ExploreFeedNav'
import { COMMUNITY_LIMIT } from '../../utils/config'

const newPage = () => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)

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
    <div className="pt-6">
      <div className="w-full flex justify-center shrink-0">
        <div className="max-w-[650px] shrink-0">
          <ExploreFeedNav />
        </div>
      </div>
      <InfiniteScroll
        dataLength={communities.length}
        next={getNewCommunities}
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

export default newPage
