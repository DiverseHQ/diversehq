import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PublicationTypes, usePublicationsQuery } from '../../graphql/generated'
import { LENS_POST_LIMIT } from '../../utils/config.ts'
import LensPostCard from './LensPostCard'

const LensPostsProfilePublicationsColumn = ({ profileId }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)

  const profilePublicationsResult = usePublicationsQuery(
    {
      request: {
        profileId: profileId,
        cursor: cursor,
        limit: LENS_POST_LIMIT,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror]
      }
    },
    {
      enabled: !!profileId
    }
  )

  useEffect(() => {
    if (!profilePublicationsResult?.data?.publications?.items) return
    handleUserPublications()
  }, [profilePublicationsResult?.data?.publications?.pageInfo?.next])

  const handleUserPublications = () => {
    if (!profilePublicationsResult?.data?.publications?.items) return
    if (
      profilePublicationsResult?.data?.publications?.items.length <
      LENS_POST_LIMIT
    ) {
      setHasMore(false)
    }
    if (profilePublicationsResult?.data?.publications?.pageInfo?.next) {
      setNextCursor(
        profilePublicationsResult?.data?.publications?.pageInfo?.next
      )
    }
    setPosts([...posts, ...profilePublicationsResult.data.publications.items])
  }

  const getMorePosts = async () => {
    if (nextCursor) {
      setCursor(nextCursor)
    }
  }

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        {posts.map((post) => {
          return <LensPostCard key={post.id} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsProfilePublicationsColumn
