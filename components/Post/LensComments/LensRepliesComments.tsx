import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import { useDevice } from '../../Common/DeviceWrapper'
import LensCommentCard from './LensCommentCard'
import {
  CommentRankingFilterType,
  LimitType,
  usePublicationsQuery
} from '../../../graphql/generated'

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
  const { isMobile } = useDevice()
  const MAX_COMMENT_LEVEL = isMobile ? 3 : 6
  const { data } = usePublicationsQuery(
    {
      request: {
        where: {
          commentOn: {
            id: commentId,
            ranking: {
              filter: CommentRankingFilterType.Relevant
            }
          }
        },
        limit: LimitType.Ten
      }
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
        <span onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/p/${commentId}`}
            className="text-blue-400 cursor-hover text-sm pl-2"
          >
            {`Show ${uniqueComments.length} more repl${
              uniqueComments.length > 1 ? 'ies' : 'y'
            }`}
          </Link>
        </span>
      )}
    </>
  )
}

export default memo(LensRepliedComments)
