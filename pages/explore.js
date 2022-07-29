import React, { useEffect, useState } from 'react'
import apiEndpoint from '../api/ApiEndpoint'
import { getAllCommunities } from '../api/community'
import { COMMUNITY_LIMIT } from '../utils/commonUtils'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommunityInfoCard from '../components/Community/CommunityInfoCard'

const explore = () => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  const getMoreCommunities = async () => {
    if(!hasMore) return
    const fetchedCommunities = await getAllCommunities(COMMUNITY_LIMIT, communities.length, "top");
    console.log('fetchedCommunities', fetchedCommunities)
    if(fetchedCommunities.communities.length < COMMUNITY_LIMIT){
      setHasMore(false)
    }
    setCommunities([...communities, ...fetchedCommunities.communities])
  }
  useEffect(() => {
    getMoreCommunities()
  }, [])
  return (
    <div className='pt-6'>
        <InfiniteScroll
          dataLength={communities.length}
          next={getMoreCommunities}
          hasMore={hasMore}
          loader={<h3> Loading...</h3>}
          endMessage={<h4>Nothing more to show</h4>}
        >
          {communities.map((community) => {
            return <CommunityInfoCard key={community._id} communityInfo={community} />
          })}
        </InfiniteScroll>
    </div>
  )
}

export default explore
