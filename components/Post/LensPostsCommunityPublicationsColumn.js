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

const LensPostsCommunityPublicationsColumn = ({ communityInfo }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: myLensProfile } = useLensUserContext()

  const communityPublicationsResult = useExplorePublicationsQuery(
    {
      request: {
        metadata: {
          locale: 'en-US',
          tags: {
            all: [communityInfo._id]
          }
        },
        cursor: cursor,
        publicationTypes: [PublicationTypes.Post],
        limit: LENS_POST_LIMIT,
        sortCriteria: PublicationSortCriteria.Latest
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!communityInfo?._id
    }
  )

  useEffect(() => {
    if (!communityPublicationsResult?.data?.explorePublications?.items) return
    handleCommunityPublications()
  }, [communityPublicationsResult?.data?.explorePublications?.pageInfo?.next])

  useEffect(() => {
    console.log(
      'communityPublicationsResult.data',
      communityPublicationsResult.data
    )
  }, [communityPublicationsResult])

  const handleCommunityPublications = () => {
    console.log(
      'explorePublications',
      communityPublicationsResult?.data?.explorePublications?.items
    )
    if (!communityPublicationsResult?.data?.explorePublications?.items) return
    if (
      communityPublicationsResult?.data?.explorePublications?.items.length <
      LENS_POST_LIMIT
    ) {
      setHasMore(false)
    }
    if (
      communityPublicationsResult?.data?.explorePublications?.pageInfo?.next
    ) {
      setNextCursor(
        communityPublicationsResult?.data?.explorePublications?.pageInfo?.next
      )
    }
    setPosts([
      ...posts,
      ...communityPublicationsResult.data.explorePublications.items
    ])
  }

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
        endMessage={
          <div className="w-full flex flex-row items-center text-center justify-center py-4 text-s-text text-sm">
            --- You have reached the end ---
          </div>
        }
      >
        {posts.map((post) => {
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

export default LensPostsCommunityPublicationsColumn
