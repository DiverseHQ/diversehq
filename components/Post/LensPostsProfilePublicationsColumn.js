import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { postGetCommunityInfoUsingListOfIds } from '../../api/community'
import { PublicationTypes, usePublicationsQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { LENS_POST_LIMIT } from '../../utils/config.ts'
import MobileLoader from '../Common/UI/MobileLoader'
import useDevice from '../Common/useDevice'
import LensPostCard from './LensPostCard'

const LensPostsProfilePublicationsColumn = ({ profileId }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: myLensProfile } = useLensUserContext()
  const { isMobile } = useDevice()

  const profilePublicationsResult = usePublicationsQuery(
    {
      request: {
        profileId: profileId,
        cursor: cursor,
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
    if (!profilePublicationsResult?.data?.publications?.items) return
    handleUserPublications()
  }, [profilePublicationsResult?.data?.publications?.pageInfo?.next])

  const handleSetPosts = async (newPosts) => {
    if (newPosts.length === 0) return
    const communityIds = newPosts.map((post) => {
      if (post.metadata.tags.length === 0) return 'null'
      return post.metadata.tags[0]
    })
    const communityInfoForPosts = await postGetCommunityInfoUsingListOfIds(
      communityIds
    )
    for (let i = 0; i < newPosts.length; i++) {
      newPosts[i].communityInfo = communityInfoForPosts[i]
    }
    if (
      posts.length === 0 ||
      posts[posts.length - 1].profile.id !== newPosts[0].profile.id
    ) {
      setHasMore(true)
      setPosts(newPosts)
    } else {
      setPosts([...posts, ...newPosts])
    }
  }

  const handleUserPublications = async () => {
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
    await handleSetPosts(profilePublicationsResult.data.publications.items)
  }

  const getMorePosts = async () => {
    if (nextCursor) {
      setCursor(nextCursor)
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
        {posts.map((post) => {
          if (!post) return null
          return <LensPostCard key={post.id} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsProfilePublicationsColumn
