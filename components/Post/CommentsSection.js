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
          try {
            const res = await getCommentFromCommentId(id)
            if (res.status !== 200) return null
            const comment = await res.json()
            console.log('comment', comment)
            return comment
          } catch (error) {
            console.log(error)
          }
        })
      )
      // filter null values
      comments.filter((comment) => comment)
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
          if (!comment) return <></>
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
