import React from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExplorePublicationsQuery
} from '../../graphql/generated'
import LensPostCard from './LensPostCard'
import { LENS_POST_LIMIT } from '../../utils/config.ts'
import { useEffect } from 'react'
import { useLensUserContext } from '../../lib/LensUserContext'
import MobileLoader from '../Common/UI/MobileLoader'
import useDevice from '../Common/useDevice'
import useSort from '../Common/Hook/useSort'
const LensAllTopCommunityPublicationsColumn = ({ communityInfo }) => {
  const { data: myLensProfile } = useLensUserContext()
  const { isMobile } = useDevice()
  const { timestamp } = useSort()
  const [queryParams, setQueryParams] = useState({
    cursor: null,
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
            all: [communityInfo._id]
          }
        },
        cursor: queryParams.cursor,
        publicationTypes: [PublicationTypes.Post],
        limit: LENS_POST_LIMIT,
        sortCriteria: PublicationSortCriteria.TopCollected,
        timestamp: timestamp,
        noRandomize: true
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!communityInfo._id
    }
  )

  useEffect(() => {
    setQueryParams({
      cursor: null,
      hasMore: true,
      nextCursor: null,
      posts: []
    })
  }, [timestamp])

  useEffect(() => {
    if (!data?.explorePublications?.items) return
    console.log('data?.explorePublications', data?.explorePublications)
    let hasMore = true
    let nextCursor = null
    const newPosts = data?.explorePublications?.items
    if (newPosts.length < LENS_POST_LIMIT) {
      hasMore = false
    }
    if (data?.explorePublications?.pageInfo?.next) {
      nextCursor = data?.explorePublications?.pageInfo?.next
    }
    setQueryParams({
      ...queryParams,
      hasMore,
      nextCursor,
      posts: [...queryParams.posts, ...newPosts]
    })
  }, [data?.explorePublications?.pageInfo?.next])

  const getMorePosts = async () => {
    if (queryParams.posts.length === 0) return
    if (queryParams.nextCursor) {
      setQueryParams({
        ...queryParams,
        cursor: queryParams.nextCursor
      })
    }
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg">
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
          return (
            <LensPostCard
              key={post.id}
              post={{ ...post, communityInfo: communityInfo }}
            />
          )
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensAllTopCommunityPublicationsColumn
