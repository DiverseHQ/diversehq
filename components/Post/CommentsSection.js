import React from 'react'
import SingleComment from './SingleComment'

const CommentsSection = ({ comments, removeComment }) => {
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
              removeCommentIdFromComments={removeComment}
            />
          )
        })}
    </>
  )
}

export default CommentsSection
