import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getCommentsFromPostId } from '../../apiHelper/comment'
import { COMMENT_LIMIT } from '../../utils/config'
import MobileLoader from '../Common/UI/MobileLoader'
import CreateComment from '../Post/CreateComment'
import SingleComment from '../Post/SingleComment'
import { useDevice } from '../Common/DeviceWrapper'

const CombinedCommentSectionApiNew = ({
  postId,
  authorAddress
}: {
  postId: string
  authorAddress: string
}) => {
  const [comments, setComments] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const { isMobile } = useDevice()

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
        loader={
          isMobile ? (
            <MobileLoader />
          ) : (
            <>
              <div className="w-full sm:rounded-2xl bg-gray-100 dark:bg-s-bg animate-pulse my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                  <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[40px] sm:h-[60px]" />
                </div>
              </div>
              <div className="w-full sm:rounded-2xl bg-gray-100 dark:bg-s-bg animate-pulse my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full animate-pulse" />
                  <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                  <div className="w-6 sm:w-[50px] h-4 " />
                  <div className="w-full mr-4 rounded-2xl bg-gray-300 dark:bg-p-bg h-[40px] sm:h-[60px]" />
                </div>
              </div>
            </>
          )
        }
        endMessage={<></>}
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
