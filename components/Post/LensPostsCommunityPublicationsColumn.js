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

const LensPostsCommunityPublicationsColumn = ({ communityInfo }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: myLensProfile } = useLensUserContext()
  const { isMobile } = useDevice()

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
        sortCriteria: PublicationSortCriteria.Latest,
        noRandomize: true
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!communityInfo?._id,
      keepPreviousData: false
    }
  )

  useEffect(() => {
    setPosts([])
  }, [communityInfo._id])

  useEffect(() => {
    if (
      !communityPublicationsResult?.data?.explorePublications?.items &&
      posts.length === 0
    )
      return
    if (
      !communityPublicationsResult?.data?.explorePublications?.items.length > 0
    ) {
      setHasMore(false)
      return
    }
    handleCommunityPublications()
  }, [communityPublicationsResult?.data?.explorePublications?.pageInfo?.next])

  const handleCommunityPublications = () => {
    if (
      communityPublicationsResult?.data?.explorePublications?.items.length === 0
    ) {
      setHasMore(false)
      return
    }
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
    if (
      posts.length === 0 ||
      posts[posts.length - 1]?.metadata?.tags[0] !==
        communityPublicationsResult.data.explorePublications.items[0].metadata
          .tags[0]
    ) {
      setPosts(communityPublicationsResult.data.explorePublications.items)
    } else {
      setPosts([
        ...posts,
        ...communityPublicationsResult.data.explorePublications.items
      ])
    }
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
