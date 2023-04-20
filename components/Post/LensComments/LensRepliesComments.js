import React, { useEffect } from 'react'
import { memo } from 'react'
import { useState } from 'react'
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  useCommentFeedQuery
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import LensCommentCard from './LensCommentCard'

const LensRepliedComments = ({
  commentId,
  comments,
  setComments,
  disableFetch = false
}) => {
  const [uniqueComments, setUniqueComments] = useState([])
  const { data: lensProfile } = useLensUserContext()
  const { data } = useCommentFeedQuery(
    {
      request: {
        commentsOf: commentId,
        commentsOfOrdering: CommentOrderingTypes.Ranking,
        commentsRankingFilter: CommentRankingFilter.Relevant
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id ?? null
      },
      profileId: lensProfile?.defaultProfile?.id ?? null
    },
    {
      enabled: !!commentId && !disableFetch
    }
  )

  useEffect(() => {
    if (!data?.publications?.items) return
    handleRepliedComments()
  }, [data?.publications?.items])
  const handleRepliedComments = async () => {
    const newComments = data?.publications?.items
    if (comments.length > 0 && (!newComments || newComments.length === 0))
      return

    setComments(newComments)
  }
  useEffect(() => {
    setUniqueComments(
      comments.filter(
        (comment, index, self) =>
          index === self.findIndex((t) => t.id === comment.id)
      )
    )
  }, [comments])
  return (
    <>
      {uniqueComments.length > 0 &&
        uniqueComments.map((comment) => {
          return (
            <LensCommentCard
              key={comment?.id ? comment?.id : comment.tempId}
              comment={comment}
            />
          )
        })}
      {uniqueComments.length === 0 && <></>}
    </>
  )
}

export default memo(LensRepliedComments)
