import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PublicationTypes, usePublicationsQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { LENS_POST_LIMIT } from '../../utils/config'
import LensPostCard from './LensPostCard'

const LensCollectedPublicationsColumn = ({ walletAddress }) => {
  const [cursor, setCursor] = useState(null)
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: myLensProfile } = useLensUserContext()

  const collectPublicationResult = usePublicationsQuery(
    {
      request: {
        collectedBy: walletAddress,
        cursor: cursor,
        limit: LENS_POST_LIMIT,
        publicationTypes: [PublicationTypes.Post, PublicationTypes.Mirror]
      },
      reactionRequest: {
        profileId: myLensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!walletAddress
    }
  )

  useEffect(() => {
    if (!collectPublicationResult?.data?.publications?.items) return
    console.log(
      'collected publications',
      collectPublicationResult?.data?.publications?.items
    )
    handleUserPublications(collectPublicationResult?.data?.publications?.items)
  }, [collectPublicationResult?.data?.publications?.pageInfo?.next])

  const handleSetPosts = async (newPosts) => {
    setPosts([...posts, ...newPosts])
  }

  const handleUserPublications = async (newItems) => {
    if (!newItems) return
    if (newItems.length < LENS_POST_LIMIT) {
      setHasMore(false)
    }
    if (collectPublicationResult?.data?.publications?.pageInfo?.next) {
      setNextCursor(
        collectPublicationResult?.data?.publications?.pageInfo?.next
      )
    }
    await handleSetPosts(newItems)
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
        loader={
          <>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4" />
                <div className="w-full rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
              </div>
            </div>
            <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
              <div className="w-full flex flex-row items-center space-x-4 p-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
              </div>
              <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                <div className="w-6 sm:w-[50px] h-4 " />
                <div className="w-full mr-4 rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
              </div>
            </div>
          </>
        }
        endMessage={<></>}
      >
        {posts.map((post) => {
          return <LensPostCard key={post.id} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensCollectedPublicationsColumn