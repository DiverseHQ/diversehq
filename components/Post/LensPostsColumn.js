import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  FeedEventItemType,
  PublicationSortCriteria,
  PublicationTypes,
  useExplorePublicationsQuery,
  useProfileFeedQuery,
  usePublicationsQuery
} from '../../graphql/generated'
import LensPostCard from './LensPostCard'

/**
 * sources are profile, community, all
 *
 * for user, data is profileId
 * for community, data is communityId
 * for all, data is null
 */

const LENS_POST_LIMIT = 5

const LensPostsColumn = ({ source, data }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isProfileFeed, setIsProfileFeed] = useState(false)
  const [isExplorePublications, setIsExplorePublications] = useState(false)
  const [isUserPublications, setIsUserPublications] = useState(false)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: profileFeed } = useProfileFeedQuery(
    {
      request: {
        cursor: cursor,
        profileId: data,
        limit: LENS_POST_LIMIT,
        feedEventItemTypes: [FeedEventItemType.Post, FeedEventItemType.Mirror]
      }
    },
    {
      enabled: isProfileFeed
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

  const explorePublicationsResult = useExplorePublicationsQuery(
    {
      request: {
        cursor: cursor,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror],
        limit: LENS_POST_LIMIT,
        sortCriteria: PublicationSortCriteria.Latest
      }
    },
    {
      enabled: isExplorePublications
    }
  )

  const handleExplorePublications = () => {
    console.log('lensposts explorepublications', explorePublicationsResult.data)
    if (explorePublicationsResult?.data?.explorePublications?.pageInfo?.next) {
      setNextCursor(
        explorePublicationsResult?.data?.explorePublications?.pageInfo?.next
      )
    }
    if (
      explorePublicationsResult.data.explorePublications.items.length <
      LENS_POST_LIMIT
    ) {
      setHasMore(false)
    }
    setPosts([
      ...posts,
      ...explorePublicationsResult.data.explorePublications.items
    ])
  }

  useEffect(() => {
    if (!explorePublicationsResult?.data?.explorePublications?.items) return
    handleExplorePublications()
  }, [explorePublicationsResult?.data?.explorePublications?.pageInfo?.next])

  const handleGetMorePostsForAll = async () => {
    if (data) {
      setIsProfileFeed(true)
    } else {
      setIsExplorePublications(true)
    }
  }

  const usePublicationsResult = usePublicationsQuery(
    {
      request: {
        profileId: data,
        cursor: cursor,
        limit: LENS_POST_LIMIT,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror]
      }
    },
    {
      enabled: isUserPublications
    }
  )

  const handleGetMorePostsForUser = async () => {
    if (data) {
      setIsUserPublications(true)
    }
  }

  useEffect(() => {
    if (!usePublicationsResult?.data?.publications?.items) return
    handleUserPublications()
  }, [usePublicationsResult?.data?.publications?.pageInfo?.next])

  const handleUserPublications = () => {
    if (!usePublicationsResult?.data?.publications?.items) return
    if (
      usePublicationsResult?.data?.publications?.items.length < LENS_POST_LIMIT
    ) {
      setHasMore(false)
    }
    if (usePublicationsResult?.data?.publications?.pageInfo?.next) {
      setNextCursor(usePublicationsResult?.data?.publications?.pageInfo?.next)
    }
    setPosts([...posts, ...usePublicationsResult.data.publications.items])
  }

  //todo: handle community posts
  const handleGetMorePostsForCommunity = async () => {}

  const getMorePosts = async () => {
    console.log('source', source)
    if (nextCursor) {
      setCursor(nextCursor)
      return
    }
    if (source === 'user') {
      await handleGetMorePostsForUser()
    } else if (source === 'community') {
      await handleGetMorePostsForCommunity()
    } else if (source === 'all') {
      await handleGetMorePostsForAll()
    }
  }

  useEffect(() => {
    if (posts.length === 0) {
      getMorePosts()
    }
  }, [])

  // todo: use <InfiniteScroll> to load more posts
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

export default LensPostsColumn
