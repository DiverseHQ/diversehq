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
import { useLensUserContext } from '../../lib/LensUserContext'
import { useRouter } from 'next/router'
// import { useLensUserContext } from '../../lib/LensUserContext'

const LensPostsExplorePublicationsColumn = () => {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const [communityIds, setCommunityIds] = useState(null)
  const { data: myLensProfile } = useLensUserContext()
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
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
          ? myLensProfile?.defaultProfile?.id
          : null
      }
    },
    {
      enabled: !!communityIds
    }
  )
  const getMorePosts = async () => {
    if (
      nextCursor &&
      (router.pathname === '/' || router.pathname === '/feed/lens')
    ) {
      console.log('fetching more posts')
      setCursor(nextCursor)
      return
    }
  }

  const handleSetPosts = async (newPosts) => {
    const communityIds = newPosts.map((post) => post.metadata.tags[0])
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      newPosts[i].communityInfo = communityInfoForPosts[i]
    }
    setPosts([...posts, ...newPosts])
  }

  const handleExplorePublications = async () => {
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
    //tag ids out of object
    allCommunitiesIds = allCommunitiesIds?.map((community) => community._id)
    setCommunityIds(allCommunitiesIds)
  }

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={
          <>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4" />
                <div className="w-full rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
              </div>
            </div>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4 " />
                <div className="w-full mr-4 rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
              </div>
            </div>
          </>
        }
        endMessage={<></>}
      >
        {posts.map((post, index) => {
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsExplorePublicationsColumn
