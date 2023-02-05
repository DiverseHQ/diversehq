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
import { usePostIndexing } from './IndexingContext/PostIndexingWrapper'
import IndexingPostCard from './IndexingPostCard'
import { sortTypes } from '../../utils/config'
import { memo } from 'react'
// import { useLensUserContext } from '../../lib/LensUserContext'

const LensPostsExplorePublicationsColumn = () => {
  const router = useRouter()
  const { data: myLensProfile } = useLensUserContext()
  const { posts: indexingPost } = usePostIndexing()
  const [loading, setLoading] = useState(true)
  const [exploreQueryRequestParams, setExploreQueryRequestParams] = useState({
    communityIds: null,
    cursor: null,
    sortCriteria: PublicationSortCriteria.Latest,
    timestamp: null,
    hasMore: true,
    nextCursor: null,
    posts: []
  })
  const { data } = useExplorePublicationsQuery(
    {
      request: {
        metadata: {
          locale: 'en-US',
          tags: {
            oneOf: exploreQueryRequestParams.communityIds
          }
        },
        cursor: exploreQueryRequestParams.cursor,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror],
        limit: LENS_POST_LIMIT,
        sortCriteria: exploreQueryRequestParams.sortCriteria,
        timestamp: exploreQueryRequestParams.timestamp
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
          ? myLensProfile?.defaultProfile?.id
          : null
      }
    },
    {
      enabled: exploreQueryRequestParams.communityIds !== null
    }
  )

  useEffect(() => {
    console.log('router.query.sort', router.query.sort)
    if (!router.query.sort) return
    // empty posts array, reset cursor, and set sort criteria
    setLoading(true)
    let timestamp = null
    let sortCriteria = PublicationSortCriteria.Latest
    if (router.query.sort === sortTypes.LATEST) {
      timestamp = null
      sortCriteria = PublicationSortCriteria.Latest
    } else {
      if (router.query.sort === sortTypes.TOP_TODAY) {
        // set timestamp to 24 hours ago
        timestamp = Date.now() - 86400000
      } else if (router.query.sort === sortTypes.TOP_WEEK) {
        // set timestamp to 7 days ago
        timestamp = Date.now() - 604800000
      } else if (router.query.sort === sortTypes.TOP_MONTH) {
        // set timestamp to 30 days ago
        timestamp = Date.now() - 2592000000
      } else {
        timestamp = null
      }
      sortCriteria = PublicationSortCriteria.TopCollected
      // timestamp is required for top collected sort criteria
    }
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      cursor: null,
      sortCriteria,
      timestamp,
      hasMore: true,
      nextCursor: null,
      posts: []
    })
  }, [router.query])

  const getMorePosts = async () => {
    console.log('getMorePosts called')
    if (
      exploreQueryRequestParams.nextCursor &&
      (router.pathname === '/' || router.pathname === '/feed/all')
    ) {
      console.log('fetching more posts')
      setExploreQueryRequestParams({
        ...exploreQueryRequestParams,
        cursor: exploreQueryRequestParams.nextCursor
      })
      return
    }
  }

  const handleSetPosts = async (newPosts) => {
    console.log('newPosts', newPosts)
    const communityIds = newPosts.map((post) => post.metadata.tags[0])
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      newPosts[i].communityInfo = communityInfoForPosts[i]
    }
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      posts: [...exploreQueryRequestParams.posts, ...newPosts]
    })
  }

  const handleExplorePublications = async () => {
    let nextCursor = null
    let hasMore = true
    if (data?.explorePublications?.pageInfo?.next) {
      nextCursor = data.explorePublications.pageInfo.next
    }
    if (data.explorePublications.items.length < LENS_POST_LIMIT) {
      hasMore = false
    }
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      nextCursor,
      hasMore
    })
    await handleSetPosts(data.explorePublications.items)
  }

  useEffect(() => {
    if (!data?.explorePublications?.items) return
    if (loading) setLoading(false)
    handleExplorePublications()
  }, [data?.explorePublications?.pageInfo?.next])

  useEffect(() => {
    if (exploreQueryRequestParams.communityIds) return
    getAndSetAllCommunitiesIds()
  }, [])

  const getAndSetAllCommunitiesIds = async () => {
    let allCommunitiesIds = await getAllCommunitiesIds()
    //tag ids out of object
    allCommunitiesIds = allCommunitiesIds?.map((community) => community._id)
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      communityIds: allCommunitiesIds
    })
  }

  useEffect(() => {
    if (indexingPost.length > 0) {
      window.scrollTo(0, 0)
    }
  }, [indexingPost])

  return (
    <div>
      <InfiniteScroll
        dataLength={exploreQueryRequestParams.posts.length}
        next={getMorePosts}
        hasMore={exploreQueryRequestParams.hasMore}
        loader={
          <>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 dark:bg-s-bg animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4" />
                <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
              </div>
            </div>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 dark:bg-s-bg animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4 " />
                <div className="w-full mr-4 rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
              </div>
            </div>
          </>
        }
        endMessage={<></>}
      >
        {(!exploreQueryRequestParams.communityIds || loading) && (
          <>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 dark:bg-s-bg animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4" />
                <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
              </div>
            </div>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 dark:bg-s-bg animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4 " />
                <div className="w-full mr-4 rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
              </div>
            </div>
          </>
        )}
        {indexingPost &&
          indexingPost.map((post, index) => {
            return <IndexingPostCard key={index} postInfo={post} />
          })}
        {exploreQueryRequestParams.posts.map((post, index) => {
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default memo(LensPostsExplorePublicationsColumn)
