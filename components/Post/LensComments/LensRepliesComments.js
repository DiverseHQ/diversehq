import React, { useEffect } from 'react'
import { useState } from 'react'
import { useCommentFeedQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import LensCommentCard from './LensCommentCard'

const LensRepliedComments = ({ commentId, comments, setComments }) => {
  const [uniqueComments, setUniqueComments] = useState([])
  const { data: lensProfile } = useLensUserContext()
  const { data } = useCommentFeedQuery(
    {
      request: {
        commentsOf: commentId
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!commentId
    }
  )

  useEffect(() => {
    if (!data?.publications?.items) return
    handleRepliedComments()
  }, [data?.publications?.items])
  const handleRepliedComments = async () => {
    const newComments = data?.publications?.items
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
        uniqueComments.map((comment, index) => {
          return <LensCommentCard key={index} comment={comment} />
        })}
      {uniqueComments.length === 0 && <></>}
    </>
  )
}

export default LensRepliedComments
