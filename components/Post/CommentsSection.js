import React, { useEffect, useState } from 'react'
import apiEndpoint from '../../api/ApiEndpoint'
import SingleComment from './SingleComment'

const CommentsSection = ({ commentsId, setPostInfo }) => {
  const [comments, setComments] = useState(null)
  useEffect(() => {
    ;(async () => {
      try {
        const comments = await Promise.all(
          commentsId.map(async (id, index) => {
            const response = await fetch(`${apiEndpoint}/comment/${id}`).then(
              (r) => r
            )
            if (!response.ok) return
            const comment = await response.json()

            const response2 = await fetch(
              `${apiEndpoint}/user/${comment.author}`
            ).then((r) => r)
            if (!response2.ok) return
            const authorDetails = await response2.json()
            return {
              authorDetails,
              ...comment
            }
          })
        )
        console.log('comments', comments)
        setComments(comments)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [commentsId])

  return (
    <>
      {!comments && <div>loading...</div>}
      {comments &&
        comments.map((comment, index) => {
          return (
            <SingleComment
              comment={comment}
              key={index}
              setPostInfo={setPostInfo}
            />
          )
        })}
    </>
  )
}

export default CommentsSection
