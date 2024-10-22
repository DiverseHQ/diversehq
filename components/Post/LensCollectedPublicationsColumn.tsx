import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { postGetCommunityInfoUsingListOfIds } from '../../apiHelper/community'
import { LimitType, usePublicationsQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { LENS_POST_LIMIT } from '../../utils/config'
// import { getCommunityInfoFromAppId } from '../../utils/helper'
import MobileLoader from '../Common/UI/MobileLoader'
import LensPostCard from './LensPostCard'
import { useDevice } from '../Common/DeviceWrapper'

const LensCollectedPublicationsColumn = ({
  profileId
}: {
  profileId: string
}) => {
  const { data: myLensProfile } = useLensUserContext()
  const { isMobile } = useDevice()

  const [queryParams, setQueryParams] = useState({
    cursor: null,
    hasMore: true,
    nextCursor: null,
    posts: []
  })

  const collectPublicationResult = usePublicationsQuery(
    {
      request: {
        cursor: queryParams.cursor,
        limit: LimitType.Fifty,
        where: {
          actedBy: profileId
        }
      }
    },
    {
      enabled: !!profileId
    }
  )

  useEffect(() => {
    if (!collectPublicationResult?.data?.publications?.items) return
    handleUserPublications(collectPublicationResult?.data?.publications?.items)
  }, [collectPublicationResult?.data?.publications?.items])

  const handleUserPublications = async (newItems) => {
    if (!newItems) return
    let hasMore = queryParams.hasMore
    let nextCursor = queryParams.nextCursor
    if (newItems.length < LENS_POST_LIMIT) {
      hasMore = false
    }
    if (collectPublicationResult?.data?.publications?.pageInfo?.next) {
      nextCursor = collectPublicationResult?.data?.publications?.pageInfo?.next
    }

    const newPosts = newItems

    if (newPosts.length === 0) return
    const communityIds = newPosts.map((post) => {
      if (post?.metadata?.tags?.[0]) {
        return post.metadata.tags[0]
      }
      if (post?.__typename === 'Mirror') {
        return post.mirrorOn?.metadata?.tags[0]
      }
      return 'null'
    })
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      // if (!communityInfoForPosts[i]?._id) {
      //   newPosts[i].communityInfo = getCommunityInfoFromAppId(newPosts[i].appId)
      // } else {
      if (communityInfoForPosts[i]?._id) {
        if (newPosts[i]?.__typename === 'Mirror') {
          let mirrorPost = newPosts[i]
          newPosts[i] = mirrorPost?.mirrorOn
          newPosts[i].mirroredBy = mirrorPost.by
          newPosts[i].originalMirrorPublication = mirrorPost
        }
        newPosts[i].communityInfo = communityInfoForPosts[i]
        if (communityInfoForPosts[i]?.handle) {
          newPosts[i].isLensCommunityPost = true
        }
      }
    }
    setQueryParams({
      ...queryParams,
      posts: [...queryParams.posts, ...newPosts],
      hasMore,
      nextCursor
    })
  }

  useEffect(() => {
    if (!myLensProfile?.defaultProfile?.id) return
    setQueryParams({
      cursor: null,
      hasMore: true,
      nextCursor: null,
      posts: []
    })
  }, [myLensProfile?.defaultProfile?.id])

  const getMorePosts = async () => {
    if (queryParams.nextCursor) {
      setQueryParams({
        ...queryParams,
        cursor: queryParams.nextCursor
      })
    }
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        dataLength={queryParams.posts.length}
        next={getMorePosts}
        hasMore={queryParams.hasMore}
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
          )
        }
        endMessage={<></>}
      >
        {queryParams.posts.map((post) => {
          return <LensPostCard key={post.id} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensCollectedPublicationsColumn
