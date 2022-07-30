import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import apiEndpoint from '../../api/ApiEndpoint'
import { getSinglePostInfo } from '../../api/post'
import CommentsSection from '../../components/Post/CommentsSection'
import CreateComment from '../../components/Post/CreateComment'
import PostCard from '../../components/Post/PostCard'

const PostPage = () => {
  const { id } = useRouter().query
  const [postInfo, setPostInfo] = React.useState(null)
  const [comments, setComments] = React.useState([])

  React.useEffect(() => {
    if (id) fetchPostInformation()
  }, [id])

  useEffect(() => {
    if (postInfo) {
      setComments(postInfo.comments)
    }
  },[postInfo])

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
    setComments([commentId,...comments])
  }
  return (
      <>
      {!postInfo && <div>Loading...</div>}
      {postInfo &&
      <div>
      <PostCard post={postInfo} />
      <div>
      <CreateComment postId={postInfo._id} authorAddress={postInfo.author} addCommentIdToComments={addCommentIdToComments}/>
      <CommentsSection commentsId={comments} />
      {/* <div className='fixed bottom-16'> */}
      {/* </div> */}
      </div>
   </div>
      }

    </>
  )
}

export default PostPage
