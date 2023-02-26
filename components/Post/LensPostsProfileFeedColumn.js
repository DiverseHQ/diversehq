import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FeedEventItemType, useProfileFeedQuery } from '../../graphql/generated'
import LensPostCard from './LensPostCard'
import { LENS_POST_LIMIT } from '../../utils/config.ts'
import MobileLoader from '../Common/UI/MobileLoader'
import useDevice from '../Common/useDevice'

const LensPostsProfileFeedColumn = ({ profileId }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { isMobile } = useDevice()

  const { data: profileFeed } = useProfileFeedQuery(
    {
      request: {
        cursor: cursor,
        profileId: profileId,
        limit: LENS_POST_LIMIT,
        feedEventItemTypes: [FeedEventItemType.Post]
      },
      reactionRequest: {
        profileId: profileId
      }
    },
    {
      enabled: !!profileId
    }
  )

  const hanldeProfileFeed = () => {
    if (profileFeed.feed?.pageInfo?.next) {
      setNextCursor(profileFeed.feed?.pageInfo?.next)
    }
    if (profileFeed.feed.items.length < LENS_POST_LIMIT) {
      setHasMore(false)
    }
    // if(profileFeed.feed.)
    setPosts([...posts, ...profileFeed.feed.items])
  }

  useEffect(() => {
    if (!profileFeed) return
    hanldeProfileFeed()
  }, [profileFeed?.feed?.items])

  const getMorePosts = async () => {
    if (nextCursor) {
      setCursor(nextCursor)
      return
    }
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg">
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
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
        {posts.map((post, index) => {
          return <LensPostCard key={index} post={post.root} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsProfileFeedColumn
