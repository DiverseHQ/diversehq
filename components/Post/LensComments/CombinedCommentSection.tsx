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
import { useCommentStore } from '../../../store/comment'
// import { isNullableType } from 'graphql'
// import index from '../../../pages/explore'

/* eslint-disable */

const CombinedCommentSection = ({
  postId,
  postInfo
}: {
  postId: string
  postInfo: postWithCommunityInfoType
}) => {
  const [params, setParams] = useState({
    comments: [],
    hasMore: true,
    cursor: null,
    nextCursor: null,
    postId
  })

  useEffect(() => {
    setParams({
      comments: [],
      hasMore: true,
      cursor: null,
      nextCursor: null,
      postId
    })
  }, [postId])

  const { hasProfile, isSignedIn, data: lensProfile } = useLensUserContext()
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { isMobile } = useDevice()
  const setCurrentReplyComment = useCommentStore(
    (state) => state.setCurrentReplyComment
  )
  const currentReplyComment = useCommentStore(
    (state) => state.currentReplyComment
  )

  const { data, isLoading } = useCommentFeedQuery(
    {
      request: {
        cursor: params.cursor,
        commentsOf: params.postId,
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
      enabled: !!params.postId
    }
  )

  useEffect(() => {
    if (data?.publications?.items) {
      handleCommentsPublications()
    }
  }, [data?.publications?.pageInfo?.next])

  const handleCommentsPublications = async () => {
    setParams({
      ...params,
      nextCursor: data?.publications?.pageInfo?.next ?? params.nextCursor,
      hasMore:
        data?.publications?.items?.length < LENS_COMMENT_LIMIT ||
        !data?.publications?.items
          ? false
          : params.hasMore,
      // @ts-ignore
      comments: data?.publications?.items
        ? [...params.comments, ...data?.publications?.items]
        : params.comments
    })
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

      setParams({
        ...params,
        comments: [comment, ...params.comments]
      })
      return
    }

    const prevComments = params.comments
    const newCommentsFirstPhase = [comment, ...prevComments]
    setParams({
      ...params,
      comments: newCommentsFirstPhase
    })
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
    setParams({
      ...params,
      comments: newCommentsSecondPhase
    })
  }

  useEffect(() => {
    setCurrentReplyComment(null)
  }, [postInfo?.id])

  const getMorePosts = async () => {
    if (params.nextCursor) {
      setParams({
        ...params,
        cursor: params.nextCursor
      })
      return
    }
  }

  const uniqueComments = params?.comments.filter(
    (comment, index, self) =>
      index === self.findIndex((t) => t.id === comment.id)
  )

  return (
    <div
      className={`sm:rounded-2xl bg-s-bg overflow-hidden ${
        hasProfile && isSignedIn && lensProfile?.defaultProfile?.id && !isMobile
          ? 'border-[1px] border-s-border'
          : ''
      }`}
    >
      {/* create commentd */}
      {postInfo && !currentReplyComment && (
        <LensCreateComment
          postId={postId}
          addComment={addComment}
          postInfo={postInfo}
          isMainPost={true}
          canCommnet={postInfo?.canComment?.result}
          // setComments={setComments}
        />
      )}

      {/* comments section */}
      <InfiniteScroll
        dataLength={uniqueComments.length}
        next={getMorePosts}
        hasMore={params.hasMore}
        loader={<MobileLoader />}
        endMessage={<></>}
      >
        {uniqueComments?.length === 0 && params.hasMore && isLoading && (
          <MobileLoader />
        )}
        {uniqueComments.length > 0 && (
          <div className="bg-s-bg px-3 sm:px-5 py-4 border-t border-[#eee] dark:border-p-border">
            {uniqueComments.map((comment) => {
              return (
                <LensCommentCard
                  key={comment?.id ?? comment.tempId}
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
