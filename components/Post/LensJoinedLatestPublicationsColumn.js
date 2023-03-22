import { useRouter } from 'next/router'
import React, { memo, useEffect, useState } from 'react'
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
  LENS_POST_LIMIT
} from '../../utils/config'
import useRouterLoading from '../Common/Hook/useRouterLoading'
import LensPostCard from '../Post/LensPostCard'
import useDevice from '../Common/useDevice'
import MobileLoader from '../Common/UI/MobileLoader'
import { getCommunityInfoFromAppId } from '../../utils/helper'
const LensJoinedLatestPublicationsColumn = ({ communityIds }) => {
  const router = useRouter()
  const { data: myLensProfile } = useLensUserContext()
  const [exploreQueryRequestParams, setExploreQueryRequestParams] = useState({
    cursor: null,
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
        publicationTypes: [PublicationTypes.Post],
        limit: LENS_POST_LIMIT,
        sortCriteria: PublicationSortCriteria.Latest,
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
    const newPosts = data.explorePublications.items
    if (newPosts.length < LENS_POST_LIMIT) {
      hasMore = false
    }
    const communityIds = newPosts.map((post) => post.metadata.tags[0])
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      if (!communityInfoForPosts[i]?._id) {
        newPosts[i].communityInfo = getCommunityInfoFromAppId(newPosts[i].appId)
      } else {
        newPosts[i].communityInfo = communityInfoForPosts[i]
        if (!!communityInfoForPosts[i]?.handle) {
          newPosts[i].isLensCommunityPost = true
        }
      }
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
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
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
              <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-s-bg dark:bg-s-bg my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4 animate-pulse">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full " />
                  <div className="h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:py-2 py-1 pr-4 my-1 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-xl bg-gray-300 dark:bg-p-bg h-[20px] sm:h-[20px]" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:pb-2 pr-4 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
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
              <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-s-bg dark:bg-s-bg my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4 animate-pulse">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full " />
                  <div className="h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:py-2 py-1 pr-4 my-1 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-xl bg-gray-300 dark:bg-p-bg h-[20px] sm:h-[20px]" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:pb-2 pr-4 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
                </div>
              </div>
            </>
          )}
        {exploreQueryRequestParams.posts.map((post, index) => {
          return <LensPostCard key={index} post={post} loading={false} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default memo(LensJoinedLatestPublicationsColumn)
