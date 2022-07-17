import { useRouter } from 'next/router'
import React from 'react'
import apiEndpoint from '../../api/ApiEndpoint'
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
  return (
      <>
      {!postInfo && <div>Loading...</div>}
      {postInfo &&
      <>
      <PostCard post={postInfo} />
      <CommentsSection commentsId={postInfo.comments} />
      <CreateComment postId={postInfo._id} />
      </>
      }

    </>
  )
}

export default PostPage
