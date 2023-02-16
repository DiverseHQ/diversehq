import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { postGetCommunityInfoUsingListOfIds } from '../../api/community'
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExplorePublicationsQuery
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import {
  LENS_INFINITE_SCROLL_THRESHOLD,
  LENS_POST_LIMIT,
  sortTypes
} from '../../utils/config'
import useRouterLoading from '../Common/Hook/useRouterLoading'
import LensPostCard from '../Post/LensPostCard'
import useDevice from '../Common/useDevice'
import MobileLoader from '../Common/UI/MobileLoader'

const LensPostJoinedCommunitiesPublications = ({ communityIds }) => {
  const router = useRouter()
  const { data: myLensProfile } = useLensUserContext()
  const [exploreQueryRequestParams, setExploreQueryRequestParams] = useState({
    communityIds: null,
    cursor: null,
    sortCriteria: PublicationSortCriteria.Latest,
    sortType: sortTypes.LATEST,
    timestamp: null,
    hasMore: true,
    nextCursor: null,
    posts: []
  })
  const { loading: routeLoading } = useRouterLoading()
  const { isMobile } = useDevice()

  const { data } = useExplorePublicationsQuery(
    {
      request: {
        metadata: {
          locale: 'en-US',
          tags: {
            oneOf: communityIds
          }
        },
        cursor: exploreQueryRequestParams.cursor,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror],
        limit: LENS_POST_LIMIT,
        sortCriteria: exploreQueryRequestParams.sortCriteria,
        timestamp: exploreQueryRequestParams.timestamp,
        noRandomize: true
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
          ? myLensProfile?.defaultProfile?.id
          : null
      }
    },
    {
      enabled:
        !!communityIds && router.pathname === '/feed/foryou' && !routeLoading
    }
  )

  useEffect(() => {
    if (!router.query.sort) return
    if (exploreQueryRequestParams.sortType === router.query.sort) return
    // empty posts array, reset cursor, and set sort criteria
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
      sortType: String(router.query.sort),
      sortCriteria,
      timestamp,
      hasMore: true,
      nextCursor: null,
      posts: []
    })
  }, [router.query])

  const getMorePosts = async () => {
    console.log('get more posts')
    console.log('exploreQueryRequestParams', exploreQueryRequestParams)
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      cursor: exploreQueryRequestParams.nextCursor
    })
  }

  const handleExplorePublications = async () => {
    let nextCursor = null
    let hasMore = true
    if (data?.explorePublications?.pageInfo?.next) {
      nextCursor = data.explorePublications.pageInfo.next
    }
    const newPosts: any = data.explorePublications.items
    if (newPosts.length < LENS_POST_LIMIT) {
      hasMore = false
    }
    const communityIds = newPosts.map((post) => post.metadata.tags[0])
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      newPosts[i].communityInfo = communityInfoForPosts[i]
    }
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      nextCursor,
      hasMore,
      posts: [...exploreQueryRequestParams.posts, ...newPosts]
    })
  }

  useEffect(() => {
    if (!data?.explorePublications?.items) return
    handleExplorePublications()
  }, [data?.explorePublications?.pageInfo?.next])

  return (
    <div>
      <InfiniteScroll
        scrollThreshold={LENS_INFINITE_SCROLL_THRESHOLD}
        dataLength={exploreQueryRequestParams.posts.length}
        next={getMorePosts}
        hasMore={
          exploreQueryRequestParams.hasMore &&
          !routeLoading &&
          router.pathname === '/feed/foryou'
        }
        loader={
          isMobile ? (
            <MobileLoader />
          ) : (
            <>
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
          )
        }
        endMessage={<></>}
      >
        {exploreQueryRequestParams.posts.length === 0 &&
          exploreQueryRequestParams.hasMore && (
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
        {exploreQueryRequestParams.posts.map((post, index) => {
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostJoinedCommunitiesPublications
