import React from 'react'
import { getSinglePostInfo } from '../../../api/post'
import CommentsSection from '../CommentsSection'
import CreateComment from '../CreateComment'
import PostCard from '../PostCard'

const PostPage = ({ id }) => {
  const [postInfo, setPostInfo] = React.useState(null)

  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    if (id) fetchPostInformation()
  }, [id])

  const fetchPostInformation = async () => {
    try {
      const res = await getSinglePostInfo(id)
      if (res.status !== 200) {
        setNotFound(true)
      }
      const post = await res.json()
      console.log(post)
      setPostInfo(post)
    } catch (error) {
      console.log(error)
    }
  }

  const addCommentIdToComments = (commentId) => {
    setPostInfo((prev) => {
      return {
        ...prev,
        comments: [commentId, ...prev.comments]
      }
    })
  }
  const removeCommentIdFromComments = (commentId) => {
    setPostInfo((prev) => {
      return {
        ...prev,
        comments: prev.comments.filter((id) => id !== commentId)
      }
    })
  }
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[650px] shrink-0">
        {!postInfo && <div>Loading...</div>}
        {notFound ? (
          <div className="flex items-center justify-center w-full bg-s-bg p-3 my-6 sm:rounded-3xl shadow-lg text-bold text-2xl">
            <h2>Post was deleted or does not exist</h2>
          </div>
        ) : (
          postInfo && (
            <div>
              <PostCard post={postInfo} setNotFound={setNotFound} />
              <div>
                <CreateComment
                  postId={postInfo._id}
                  authorAddress={postInfo.author}
                  addCommentIdToComments={addCommentIdToComments}
                />
                <CommentsSection
                  commentsId={postInfo.comments}
                  removeCommentIdFromComments={removeCommentIdFromComments}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default PostPage
