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
import Link from 'next/link'

export const MAX_COMMENT_LEVEL = 6

const LensRepliedComments = ({
  commentId,
  comments,
  setComments,
  hideBottomRow = false,
  disableFetch = false,
  level
}: {
  commentId: string
  comments: any[]
  setComments: any
  hideBottomRow?: boolean
  disableFetch?: boolean
  level?: number
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
      {level <= MAX_COMMENT_LEVEL &&
        uniqueComments.length > 0 &&
        uniqueComments.map((comment) => {
          return (
            <LensCommentCard
              key={comment?.id ? comment?.id : comment.tempId}
              comment={comment}
              hideBottomRow={hideBottomRow}
              level={level}
            />
          )
        })}
      {level > MAX_COMMENT_LEVEL && uniqueComments.length > 0 && (
        <Link href={`/p/${commentId}`} className="text-blue-400 cursor-hover">
          {`Show ${uniqueComments.length} more replies`}
        </Link>
      )}
    </>
  )
}

export default memo(LensRepliedComments)
