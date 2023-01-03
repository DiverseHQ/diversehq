import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCommentFeedQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { LENS_COMMENT_LIMIT } from '../../../utils/config'
import LensCommentCard from './LensCommentCard'
import LensCreateComment from './LensCreateComment'

const CombinedCommentSection = ({ postId, postInfo }) => {
  const [comments, setComments] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: lensProfile } = useLensUserContext()

  const { data } = useCommentFeedQuery(
    {
      request: {
        cursor: cursor,
        commentsOf: postId,
        limit: LENS_COMMENT_LIMIT
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!postId
    }
  )

  useEffect(() => {
    if (!data?.publications?.items) return
    handleCommentsPublications()
  }, [data?.publications?.pageInfo?.next])

  const handleCommentsPublications = async () => {
    console.log('comments data', data)
    if (data?.publications?.pageInfo?.next) {
      setNextCursor(data?.publications?.pageInfo?.next)
    }
    if (data?.publications?.items.length < LENS_COMMENT_LIMIT) {
      setHasMore(false)
    }
    const newComments = data?.publications?.items
    setComments([...comments, ...newComments])
  }

  const getMorePosts = async () => {
    if (nextCursor) {
      setCursor(nextCursor)
      return
    }
  }
  return (
    <div>
      {/* create commentd */}
      {postInfo && (
        <LensCreateComment
          postId={postId}
          authorAddress={postInfo.profile}
          setComments={setComments}
        />
      )}
      {/* comments section */}
      <div>
        <InfiniteScroll
          dataLength={comments.length}
          next={getMorePosts}
          hasMore={hasMore}
          loader={<h3>Loading...</h3>}
          endMessage={
            <div className="w-full flex flex-row items-center text-center justify-center">
              --- Nothing more to show ---
            </div>
          }
        >
          {comments.map((comment, index) => {
            return <LensCommentCard key={index} comment={comment} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default CombinedCommentSection
