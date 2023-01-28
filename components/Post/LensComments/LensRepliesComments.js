import React, { useEffect } from 'react'
import { useCommentFeedQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import LensCommentCard from './LensCommentCard'

const LensRepliedComments = ({ commentId, comments, setComments }) => {
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
  return (
    <>
      {comments.length > 0 &&
        comments.map((comment, index) => {
          return <LensCommentCard key={index} comment={comment} />
        })}
      {comments.length === 0 && <></>}
    </>
  )
}

export default LensRepliedComments
