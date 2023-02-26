import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  ReactionTypes,
  useAddReactionMutation,
  useCommentFeedQuery
} from '../../../graphql/generated'
import { pollUntilIndexed } from '../../../lib/indexer/has-transaction-been-indexed'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { LENS_COMMENT_LIMIT } from '../../../utils/config'
import { commentIdFromIndexedResult } from '../../../utils/utils'
import LensCommentCard from './LensCommentCard'
import LensCreateComment from './LensCreateComment'
import MobileLoader from '../../Common/UI/MobileLoader'
import useDevice from '../../Common/useDevice'

const CombinedCommentSection = ({ postId, postInfo }) => {
  const [comments, setComments] = useState([])
  const [uniqueComments, setUniqueComments] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { data: lensProfile } = useLensUserContext()
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { isMobile } = useDevice()

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
    if (data?.publications?.pageInfo?.next) {
      setNextCursor(data?.publications?.pageInfo?.next)
    }
    if (data?.publications?.items.length < LENS_COMMENT_LIMIT) {
      setHasMore(false)
    }
    const newComments = data?.publications?.items
    setComments([...comments, ...newComments])
  }

  const addComment = async (tx, comment) => {
    const prevComments = comments
    const newCommentsFirstPhase = [comment, ...prevComments]
    setComments(newCommentsFirstPhase)
    const indexResult = await pollUntilIndexed(tx)

    const commentId = commentIdFromIndexedResult(
      lensProfile?.defaultProfile?.id,
      indexResult
    )

    await addReaction({
      request: {
        profileId: lensProfile?.defaultProfile?.id,
        publicationId: commentId,
        reaction: ReactionTypes.Upvote
      }
    })
    const newCommentsSecondPhase = newCommentsFirstPhase.map((c) =>
      c.tempId === comment.tempId ? { ...c, id: commentId } : c
    )
    // add id to that comment
    setComments(newCommentsSecondPhase)
    // add comment id to comment
    // remove previous comment
    // setComments(comments.filter((c) => c.tempId !== comment.tempId))
    // add new comment
    // setComments([comment, ...comments])
  }

  useEffect(() => {
    if (!comments || comments.length === 0) return
    setUniqueComments(
      comments.filter(
        (comment, index, self) =>
          index === self.findIndex((t) => t.id === comment.id)
      )
    )
  }, [comments])

  const getMorePosts = async () => {
    if (nextCursor) {
      setCursor(nextCursor)
      return
    }
  }

  return (
    <div className="sm:rounded-2xl bg-s-bg py-2 ">
      {/* create commentd */}
      {postInfo && (
        <LensCreateComment
          postId={postId}
          addComment={addComment}
          postInfo={postInfo}
          // setComments={setComments}
        />
      )}
      {/* comments section */}

      <InfiniteScroll
        dataLength={comments.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={
          isMobile ? (
            <MobileLoader />
          ) : (
            <>
              <div className="w-full sm:rounded-2xl bg-gray-100 dark:bg-s-bg animate-pulse sm:my-3">
                <div className="w-full flex flex-row items-center space-x-4 p-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                  <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[40px] sm:h-[60px]" />
                </div>
              </div>
              <div className="w-full sm:rounded-2xl bg-gray-100 dark:bg-s-bg animate-pulse sm:my-3">
                <div className="w-full flex flex-row items-center space-x-4 p-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                  <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                  <div className="w-6 sm:w-[50px] h-4 " />
                  <div className="w-full mr-4 rounded-2xl bg-gray-300 dark:bg-p-bg h-[40px] sm:h-[60px]" />
                </div>
              </div>
            </>
          )
        }
        endMessage={<></>}
      >
        {uniqueComments.length > 0 && (
          <div className="bg-s-bg px-3 sm:px-5 py-4 border-t border-[#eee] dark:border-p-border">
            {uniqueComments.map((comment, index) => {
              return <LensCommentCard key={index} comment={comment} />
            })}
          </div>
        )}
      </InfiniteScroll>
    </div>
  )
}

export default CombinedCommentSection
