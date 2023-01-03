import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getCommentsFromPostId } from '../../api/comment'
import { COMMENT_LIMIT } from '../../utils/config'
import CreateComment from '../Post/CreateComment'
import SingleComment from '../Post/SingleComment'

const CombinedCommentSectionApiNew = ({ postId, authorAddress }) => {
  const [comments, setComments] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const handleGetMoreComments = async () => {
    try {
      if (!hasMore) return
      const res = await getCommentsFromPostId(
        postId,
        COMMENT_LIMIT,
        comments.length,
        'new'
      )
      if (res.status !== 200) return
      const { comments: newComments } = await res.json()
      console.log('newComments', newComments)
      if (newComments.length < COMMENT_LIMIT) {
        setHasMore(false)
      }
      if (newComments.length === 0) return
      // setComments((prev) => [...prev, ...newComments])
      setComments([...comments, ...newComments])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log('change post', postId)
    setComments([])
    setHasMore(true)
  }, [postId])

  useEffect(() => {
    if (hasMore && comments.length === 0) {
      handleGetMoreComments()
    }
  }, [postId, hasMore, comments])

  const removeComment = (commentId) => {
    setComments((prev) => {
      return prev.filter((comment) => comment._id !== commentId)
    })
  }

  return (
    <div>
      <CreateComment
        postId={postId}
        authorAddress={authorAddress}
        setComments={setComments}
      />

      <InfiniteScroll
        dataLength={comments.length}
        next={handleGetMoreComments}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={
          <div className="w-full flex flex-row items-center text-center justify-center py-4">
            --- You have reached the end ---
          </div>
        }
      >
        {comments.map((comment) => {
          return (
            <SingleComment
              commentInfo={comment}
              key={comment._id}
              removeCommentIdFromComments={removeComment}
            />
          )
        })}
      </InfiniteScroll>
    </div>
  )
}

export default CombinedCommentSectionApiNew
