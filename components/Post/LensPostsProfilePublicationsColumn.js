import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { postGetCommunityInfoUsingListOfIds } from '../../api/community'
import { PublicationTypes, usePublicationsQuery } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import { LENS_POST_LIMIT } from '../../utils/config.ts'
import LensPostCard from './LensPostCard'

const LensPostsProfilePublicationsColumn = ({ profileId }) => {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: myLensProfile } = useLensUserContext()

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
    console.log('newposts before', newPosts)
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
    setPosts([...posts, ...newPosts])
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
          return <LensPostCard key={post.id} post={post} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default LensPostsProfilePublicationsColumn
