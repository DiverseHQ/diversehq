import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FeedEventItemType, useProfileFeedQuery } from '../../graphql/generated'
import LensPostCard from './LensPostCard'
import { LENS_POST_LIMIT } from '../../utils/config'
import MobileLoader from '../Common/UI/MobileLoader'
import { useRouter } from 'next/router'
import useRouterLoading from '../Common/Hook/useRouterLoading'
import { postGetCommunityInfoUsingListOfIds } from '../../api/community'
import { getCommunityInfoFromAppId } from '../../utils/helper'
import { usePublicationStore } from '../../store/publication'
import { useProfileStore } from '../../store/profile'
import { useDevice } from '../Common/DeviceWrapper'

const LensPostsProfileFeedColumn = ({ profileId }: { profileId: string }) => {
  const router = useRouter()
  const [exploreQueryRequestParams, setExploreQueryRequestParams] = useState({
    cursor: null,
    hasMore: true,
    nextCursor: null,
    posts: []
  })
  const { isMobile } = useDevice()
  const { loading: routeLoading } = useRouterLoading()
  const addPublications = usePublicationStore((state) => state.addPublications)
  const addProfiles = useProfileStore((state) => state.addProfiles)

  const { data: profileFeed } = useProfileFeedQuery(
    {
      request: {
        cursor: exploreQueryRequestParams.cursor,
        profileId: profileId,
        limit: LENS_POST_LIMIT,
        feedEventItemTypes: [
          FeedEventItemType.CollectPost,
          FeedEventItemType.Post,
          FeedEventItemType.ReactionPost
        ]
      },
      reactionRequest: {
        profileId: profileId
      }
    },
    {
      enabled: router.pathname === '/feed/timeline' && !routeLoading
    }
  )

  const hanldeProfileFeed = async () => {
    let nextCursor = null
    let hasMore = true
    if (profileFeed?.feed?.pageInfo?.next) {
      nextCursor = profileFeed?.feed.pageInfo.next
    }
    const newPosts = profileFeed?.feed.items.map((item) => item.root)
    if (newPosts.length < LENS_POST_LIMIT) {
      hasMore = false
    }
    const communityIds = newPosts.map((post) => post.metadata.tags[0])
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      if (!communityInfoForPosts[i]?._id) {
        // @ts-ignore
        newPosts[i].communityInfo = getCommunityInfoFromAppId(newPosts[i].appId)
      } else {
        // @ts-ignore
        newPosts[i].communityInfo = communityInfoForPosts[i]
        if (communityInfoForPosts[i]?.handle) {
          // @ts-ignore
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
    if (!profileFeed?.feed?.items) return
    hanldeProfileFeed()
  }, [profileFeed?.feed?.pageInfo?.next])

  const getMorePosts = async () => {
    if (exploreQueryRequestParams.posts.length === 0) return
    setExploreQueryRequestParams({
      ...exploreQueryRequestParams,
      cursor: exploreQueryRequestParams.nextCursor
    })
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        dataLength={exploreQueryRequestParams?.posts?.length || 0}
        next={getMorePosts}
        hasMore={
          exploreQueryRequestParams.hasMore &&
          !routeLoading &&
          router.pathname === '/feed/timeline'
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
          return <LensPostCard key={index} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsProfileFeedColumn
