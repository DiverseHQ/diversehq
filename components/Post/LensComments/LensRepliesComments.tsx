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
import { useDevice } from '../../Common/DeviceWrapper'

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
  const { isMobile } = useDevice()
  const MAX_COMMENT_LEVEL = isMobile ? 3 : 6
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
        <Link
          href={`/p/${commentId}`}
          className="text-blue-400 cursor-hover text-sm pl-2"
        >
          {`Show ${uniqueComments.length} more repl${
            uniqueComments.length > 1 ? 'ies' : 'y'
          }`}
        </Link>
      )}
    </>
  )
}

export default memo(LensRepliedComments)
