import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { postGetCommunityInfoUsingListOfIds } from '../../api/community'
import { PublicationTypes, usePublicationsQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { LENS_POST_LIMIT } from '../../utils/config'
import { getCommunityInfoFromAppId } from '../../utils/helper'
import MobileLoader from '../Common/UI/MobileLoader'
import useDevice from '../Common/useDevice'
import LensPostCard from './LensPostCard'

/* tslint:disable */

const LensPostsProfilePublicationsColumn = ({ profileId }) => {
  const { data: myLensProfile } = useLensUserContext()
  const { isMobile } = useDevice()
  const [queryParams, setQueryParams] = useState({
    cursor: null,
    hasMore: true,
    nextCursor: null,
    posts: []
  })

  const profilePublicationsResult = usePublicationsQuery(
    {
      request: {
        profileId: profileId,
        cursor: queryParams.cursor,
        limit: LENS_POST_LIMIT,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror]
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!profileId
    }
  )

  useEffect(() => {
    if (!profileId) return
    setQueryParams({
      cursor: null,
      hasMore: true,
      nextCursor: null,
      posts: []
    })
  }, [profileId])

  useEffect(() => {
    if (!profilePublicationsResult?.data?.publications?.items) return
    handleUserPublications()
  }, [profilePublicationsResult?.data?.publications?.pageInfo?.next])

  const handleUserPublications = async () => {
    let hasMore = true
    let { nextCursor } = queryParams
    if (!profilePublicationsResult?.data?.publications?.items) return
    if (
      profilePublicationsResult?.data?.publications?.items.length <
      LENS_POST_LIMIT
    ) {
      hasMore = false
    }
    if (profilePublicationsResult?.data?.publications?.pageInfo?.next) {
      nextCursor = profilePublicationsResult?.data?.publications?.pageInfo?.next
    }
    const newPosts = profilePublicationsResult.data.publications.items
    if (newPosts.length === 0) return
    const communityIds = newPosts.map((post) => {
      // @ts-ignore
      if (post?.metadata?.tags?.[0]) {
        // @ts-ignore
        return post.metadata.tags[0]
      }
      if (post?.__typename === 'Mirror') {
        // @ts-ignore
        return post.mirrorOf?.metadata?.tags[0]
      }
      return 'null'
    })
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      if (!communityInfoForPosts[i]?._id) {
        // @ts-ignore
        newPosts[i].communityInfo = getCommunityInfoFromAppId(newPosts[i].appId)
      } else {
        if (newPosts[i]?.__typename === 'Mirror') {
          let mirrorPost = newPosts[i]
          // @ts-ignore
          newPosts[i] = mirrorPost?.mirrorOf
          // @ts-ignore
          newPosts[i].mirroredBy = mirrorPost.profile
        }
        // @ts-ignore
        newPosts[i].communityInfo = communityInfoForPosts[i]
      }
    }

    setQueryParams({
      ...queryParams,
      posts: [...queryParams.posts, ...newPosts],
      hasMore,
      nextCursor
    })
  }

  const getMorePosts = async () => {
    if (queryParams.nextCursor) {
      setQueryParams({
        ...queryParams,
        cursor: queryParams.nextCursor
      })
    }
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg border-[1px] border-s-border overflow-hidden">
      <InfiniteScroll
        dataLength={queryParams.posts.length}
        next={getMorePosts}
        hasMore={queryParams.hasMore}
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
        {queryParams.posts.map((post) => {
          if (!post) return null
          return <LensPostCard key={post.id} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsProfilePublicationsColumn