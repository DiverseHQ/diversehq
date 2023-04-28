import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  CommentOrderingTypes,
  CommentRankingFilter,
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
import { useDevice } from '../../Common/DeviceWrapper'
import { postWithCommunityInfoType } from '../../../types/post'

const CombinedCommentSection = ({
  postId,
  postInfo
}: {
  postId: string
  postInfo: postWithCommunityInfoType
}) => {
  const [comments, setComments] = useState([])
  const [uniqueComments, setUniqueComments] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { isMobile } = useDevice()

  const { data } = useCommentFeedQuery(
    {
      request: {
        cursor: cursor,
        commentsOf: postId,
        limit: LENS_COMMENT_LIMIT,
        commentsOfOrdering: CommentOrderingTypes.Ranking,
        commentsRankingFilter: CommentRankingFilter.Relevant
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      },
      profileId: lensProfile?.defaultProfile?.id
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
    if (!tx && comment?.id) {
      await addReaction({
        request: {
          profileId: lensProfile?.defaultProfile?.id,
          publicationId: comment.id,
          reaction: ReactionTypes.Upvote
        }
      })

      setComments([comment, ...comments])
      return
    }

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
    <div
      className={`sm:rounded-2xl bg-s-bg overflow-hidden ${
        hasProfile && isSignedIn && lensProfile?.defaultProfile?.id && !isMobile
          ? 'border-[1px] border-s-border'
          : ''
      }`}
    >
      {/* create commentd */}
      {postInfo && (
        <LensCreateComment
          postId={postId}
          addComment={addComment}
          postInfo={postInfo}
          canCommnet={postInfo?.canComment?.result}
          // setComments={setComments}
        />
      )}

      {/* comments section */}
      <InfiniteScroll
        dataLength={comments.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<MobileLoader />}
        endMessage={<></>}
      >
        {uniqueComments.length > 0 && (
          <div className="bg-s-bg px-3 sm:px-5 py-4 border-t border-[#eee] dark:border-p-border">
            {uniqueComments.map((comment) => {
              return (
                <LensCommentCard
                  key={comment?.id ? comment?.id : comment.tempId}
                  comment={comment}
                />
              )
            })}
          </div>
        )}
      </InfiniteScroll>
    </div>
  )
}

export default CombinedCommentSection
