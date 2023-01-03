import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExplorePublicationsQuery
} from '../../graphql/generated'
import { LENS_POST_LIMIT } from '../../utils/config.ts'
import {
  getAllCommunitiesIds,
  postGetCommunityInfoUsingListOfIds
} from '../../api/community'
import LensPostCard from './LensPostCard'
// import { useLensUserContext } from '../../lib/LensUserContext'

const LensPostsExplorePublicationsColumn = () => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const [communityIds, setCommunityIds] = useState(null)
  // const { data: myLensProfile } = useLensUserContext()
  const { data } = useExplorePublicationsQuery(
    {
      request: {
        metadata: {
          locale: 'en-US',
          tags: {
            oneOf: communityIds
          }
        },
        cursor: cursor,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror],
        limit: LENS_POST_LIMIT,
        sortCriteria: PublicationSortCriteria.Latest
      }
      // reactionRequest: {
      //   profileId: myLensProfile?.defaultProfile?.id
      // }
    },
    {
      enabled: !!communityIds
    }
  )
  const getMorePosts = async () => {
    if (nextCursor) {
      setCursor(nextCursor)
      return
    }
  }

  const handleSetPosts = async (newPosts) => {
    console.log('newposts before', newPosts)
    const communityIds = newPosts.map((post) => post.metadata.tags[0])
    console.log('communityIds', communityIds)
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    console.log('communityInfoForPosts', communityInfoForPosts)
    for (let i = 0; i < newPosts.length; i++) {
      newPosts[i].communityInfo = communityInfoForPosts[i]
    }
    console.log('newPosts after', newPosts)
    setPosts([...posts, ...newPosts])
  }

  const handleExplorePublications = async () => {
    console.log('lensposts explorepublications', data)
    if (data?.explorePublications?.pageInfo?.next) {
      setNextCursor(data?.explorePublications?.pageInfo?.next)
    }
    if (data.explorePublications.items.length < LENS_POST_LIMIT) {
      setHasMore(false)
    }
    await handleSetPosts(data.explorePublications.items)
  }

  useEffect(() => {
    if (!data?.explorePublications?.items) return
    handleExplorePublications()
  }, [data?.explorePublications?.pageInfo?.next])

  useEffect(() => {
    if (communityIds) return
    getAndSetAllCommunitiesIds()
  }, [])

  const getAndSetAllCommunitiesIds = async () => {
    let allCommunitiesIds = await getAllCommunitiesIds()
    console.log('allCommunitiesIds', allCommunitiesIds)
    //tag ids out of object
    allCommunitiesIds = allCommunitiesIds.map((community) => community._id)
    console.log('allCommunitiesIds', allCommunitiesIds)
    setCommunityIds(allCommunitiesIds)
  }

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<h3>Loading...</h3>}
        endMessage={
          <div className="w-full flex flex-row items-center text-center justify-center">
            --- Nothing more to show ---
          </div>
        }
      >
        {posts.map((post, index) => {
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsExplorePublicationsColumn
