import { useRouter } from 'next/router'
import React from 'react'
import { getSinglePostInfo } from '../../api/post'
import CommentsSection from '../../components/Post/CommentsSection'
import CreateComment from '../../components/Post/CreateComment'
import PostCard from '../../components/Post/PostCard'

const PostPage = () => {
  const { id } = useRouter().query
  const [postInfo, setPostInfo] = React.useState(null)

  React.useEffect(() => {
    if (id) fetchPostInformation()
  }, [id])

  const fetchPostInformation = async () => {
    try {
      const post = await getSinglePostInfo(id)
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
    <>
      {!postInfo && <div>Loading...</div>}
      {postInfo && (
        <div>
          <PostCard post={postInfo} />
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
            {/* <div className='fixed bottom-16'> */}
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  )
}

export default PostPage
