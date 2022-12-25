import React, { useEffect, useState } from 'react'
import { getAllCommunities } from '../api/community'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommunityInfoCard from '../components/Community/CommunityInfoCard'
import { COMMUNITY_LIMIT } from '../utils/config.ts'
import { SiHotjar } from 'react-icons/si'
import { HiSparkles } from 'react-icons/hi'
import { MdLeaderboard } from 'react-icons/md'

const explore = () => {
  const [communities, setCommunities] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [communityType, setCommunityType] = useState('new')

  console.log(communities, communityType)

  // useEffect(() => {
  //   getMoreCommunities()
  // }, [])

  useEffect(() => {
    setCommunities([])
    setHasMore(true)
    if (communityType === 'new') {
      getNewCommunities()
    }
    if (communityType === 'top') {
      getTopCommunities()
      console.log('working')
    }
  }, [communityType])

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

  // const getCommunities = async (type) => {
  //   setCommunities([])
  //   setHasMore(true)
  //   if (!hasMore) return
  //   const fetchedCommunities = await getAllCommunities(
  //     COMMUNITY_LIMIT,
  //     communities.length,
  //     type
  //   )
  //   console.log('fetchedCommunities', fetchedCommunities)
  //   if (fetchedCommunities.communities.length < COMMUNITY_LIMIT) {
  //     setHasMore(false)
  //   }
  //   setCommunities([...communities, ...fetchedCommunities.communities])
  // }

  // const getMoreCommunities = async () => {
  //   if (!hasMore) return
  //   const fetchedCommunities = await getAllCommunities(
  //     COMMUNITY_LIMIT,
  //     communities.length
  //   )
  //   console.log('fetchedCommunities', fetchedCommunities)
  //   if (fetchedCommunities.communities.length < COMMUNITY_LIMIT) {
  //     setHasMore(false)
  //   }
  //   setCommunities([...communities, ...fetchedCommunities.communities])
  // }

  // const getTopCommunities = async () => {
  //   setCommunities([])
  //   // if (!hasMore) return
  //   const fetchedCommunities = await getAllCommunities(
  //     COMMUNITY_LIMIT,
  //     communities.length,
  //     'top'
  //   )
  //   console.log('fetchedCommunities', fetchedCommunities)
  //   if (fetchedCommunities.communities.length < COMMUNITY_LIMIT) {
  //     setHasMore(false)
  //   }
  //   setCommunities([...fetchedCommunities.communities])
  //   // console.log('Clicked')
  //   // setCommunities((communities) => {
  //   //   console.log(communities)
  //   //   return communities.sort(
  //   //     (comm1, comm2) => comm2.membersCount - comm1.membersCount
  //   //   )
  //   // })
  // }

  return (
    <div className="pt-6">
      <InfiniteScroll
        dataLength={communities.length}
        next={() => {
          communityType === 'new' ? getNewCommunities() : getTopCommunities()
        }}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        <div className="flex flex-row items-center p-2 gap-4">
          <div
            className="flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full bg-[#fff] hover:bg-[#eee]"
            onClick={() => setCommunityType('new')}
          >
            <HiSparkles />
            <button>New</button>
          </div>
          <div
            className="flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full  hover:bg-[#eee]"
            onClick={() => setCommunityType('top')}
          >
            <MdLeaderboard />
            <button>Top</button>
          </div>
          <div className="flex items-center hover:cursor-pointer gap-2 py-1 px-2 rounded-full hover:bg-[#eee]">
            <SiHotjar />
            <button>Hot</button>
          </div>
        </div>
        {communities.map((community) => {
          return <CommunityInfoCard key={community._id} community={community} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default explore
