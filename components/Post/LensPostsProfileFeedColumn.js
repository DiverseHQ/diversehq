import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FeedEventItemType, useProfileFeedQuery } from '../../graphql/generated'
import LensPostCard from './LensPostCard'
import { LENS_POST_LIMIT } from '../../utils/config.ts'

const LensPostsProfileFeedColumn = ({ profileId }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)

  const { data: profileFeed } = useProfileFeedQuery(
    {
      request: {
        cursor: cursor,
        profileId: profileId,
        limit: LENS_POST_LIMIT,
        feedEventItemTypes: [FeedEventItemType.Post, FeedEventItemType.Mirror]
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
    console.log('lensposts profileFeed', profileFeed.feed)
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
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
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
