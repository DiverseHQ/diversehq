import React, { useEffect, useState } from 'react'
import { getCommentFromCommentId } from '../../api/comment'
import SingleComment from './SingleComment'

const CommentsSection = ({ commentsId, removeCommentIdFromComments }) => {
  const [comments, setComments] = useState(null)

  const fetchCommentsFromCommentsId = async () => {
    try {
      const comments = await Promise.all(
        commentsId.map(async (id, index) => {
          // const response = await fetch(`${apiEndpoint}/comment/${id}`).then(
          //   (r) => r
          // )
          // if (!response.ok) return
          // const comment = await response.json()

          const comment = await getCommentFromCommentId(id)
          return comment
        })
      )

      console.log('comments', comments)
      setComments(comments)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchCommentsFromCommentsId()
    })()
  }, [commentsId])

  return (
    <>
      {!comments && <div>loading...</div>}
      {comments &&
        comments.map((comment) => {
          return (
            <SingleComment
              commentInfo={comment}
              key={comment._id}
              removeCommentIdFromComments={removeCommentIdFromComments}
            />
          )
        })}
    </>
  )
}

export default CommentsSection
