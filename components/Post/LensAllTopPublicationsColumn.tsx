import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExplorePublicationsQuery
} from '../../graphql/generated'
import { LENS_POST_LIMIT, appId } from '../../utils/config'
import { postGetCommunityInfoUsingListOfIds } from '../../api/community'
import LensPostCard from './LensPostCard'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useRouter } from 'next/router'
import { usePostIndexing } from './IndexingContext/PostIndexingWrapper'
import IndexingPostCard from './IndexingPostCard'
import { LENS_INFINITE_SCROLL_THRESHOLD } from '../../utils/config'
import { memo } from 'react'
// import { useLensUserContext } from '../../lib/LensUserContext'
import useRouterLoading from '../Common/Hook/useRouterLoading'
import useDevice from '../Common/useDevice'
import MobileLoader from '../Common/UI/MobileLoader'
import useSort from '../Common/Hook/useSort'
import { getCommunityInfoFromAppId } from '../../utils/helper'
import { usePublicationStore } from '../../store/publication'
import { useProfileStore } from '../../store/profile'
import { postWithCommunityInfoType } from '../../types/post'
const LensAllTopPublicationsColumn = () => {
  const router = useRouter()
  const { data: myLensProfile } = useLensUserContext()
  const { posts: indexingPost } = usePostIndexing()
  const { timestamp } = useSort()
  const addPublications = usePublicationStore((state) => state.addPublications)
  const addProfiles = useProfileStore((state) => state.addProfiles)
  const [exploreQueryRequestParams, setExploreQueryRequestParams] = useState({
    cursor: null,
    hasMore: true,
    nextCursor: null,
    posts: []
  })

  const { loading: routeLoading } = useRouterLoading()
  const { data } = useExplorePublicationsQuery(
    {
      request: {
        cursor: exploreQueryRequestParams.cursor,
        publicationTypes: [PublicationTypes.Post],
        limit: LENS_POST_LIMIT,
        sortCriteria: PublicationSortCriteria.TopMirrored,
        noRandomize: true,
        timestamp: timestamp,
        sources: [appId]
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
          ? myLensProfile?.defaultProfile?.id
          : null
      }
    },
    {
      enabled:
        (router.pathname === '/' || router.pathname === '/feed/all') &&
        !routeLoading
    }
  )

  useEffect(() => {
    if (router.pathname !== '/' && router.pathname !== '/feed/all') return
    setExploreQueryRequestParams({
      cursor: null,
      hasMore: true,
      nextCursor: null,
      posts: []
    })
  }, [timestamp])

  useEffect(() => {
    if (router.pathname !== '/' && router.pathname !== '/feed/all') return
    if (!myLensProfile?.defaultProfile?.id) return
    setExploreQueryRequestParams({
      cursor: null,
      hasMore: true,
      nextCursor: null,
      posts: []
    })
  }, [myLensProfile?.defaultProfile?.id])

  const getMorePosts = async () => {
    if (exploreQueryRequestParams.posts.length === 0) return
    if (router.pathname !== '/' && router.pathname !== '/feed/all') return
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
    // @ts-ignore
    const newPosts: postWithCommunityInfoType[] = data.explorePublications.items
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
        if (communityInfoForPosts[i]?.handle) {
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
    // await handleSetPosts(data.explorePublications.items)

    // addProfiles & addPublications to store
    // profile to be added is a set of handle as key and profile as value
    // publication to be added is a set of id as key and publication as value

    let newProfiles = new Map()
    let newPublications = new Map()

    for (const newPost of newPosts) {
      newProfiles.set(newPost.profile.handle, newPost.profile)
      newPublications.set(newPost.id, newPost)
    }

    addProfiles(newProfiles)
    addPublications(newPublications)
  }

  useEffect(() => {
    if (router.pathname !== '/' && router.pathname !== '/feed/all') return
    if (!data?.explorePublications?.items) return
    handleExplorePublications()
  }, [data?.explorePublications?.pageInfo?.next])

  useEffect(() => {
    if (!indexingPost) return
    if (indexingPost.length > 0) {
      window.scrollTo(0, 0)
    }
  }, [indexingPost])

  const { isMobile } = useDevice()
  return (
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        scrollThreshold={LENS_INFINITE_SCROLL_THRESHOLD}
        dataLength={exploreQueryRequestParams?.posts?.length || 0}
        next={getMorePosts}
        hasMore={
          exploreQueryRequestParams.hasMore &&
          !routeLoading &&
          (router.pathname === '/' || router.pathname === '/feed/all')
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
        {indexingPost &&
          indexingPost.map((post, index) => {
            return <IndexingPostCard key={index} postInfo={post} />
          })}
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
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default memo(LensAllTopPublicationsColumn)