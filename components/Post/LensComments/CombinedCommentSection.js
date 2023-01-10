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

  const addComment = (comment) => {
    setComments([comment, ...comments])
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
          addComment={addComment}
          // setComments={setComments}
        />
      )}
      {/* comments section */}
      <div className="bg-s-bg sm:rounded-2xl my-3 px-3 sm:px-5 py-2">
        <InfiniteScroll
          dataLength={comments.length}
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
          endMessage={
            <div className="w-full flex flex-row items-center text-center justify-center py-4 text-s-text text-sm">
              --- You have reached the end ---
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
