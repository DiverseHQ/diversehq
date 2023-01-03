import React, { useState } from 'react'
import { getSinglePostInfo } from '../../../api/post'
import CombinedCommentSectionApiNew from '../../Comment/CombinedCommentSectionApiNew'
import CombinedCommentSectionApiTop from '../../Comment/CombinedCommentSectionApiTop'
import CommentFilterNav from '../../Comment/CommentFilterNav'
import PostCard from '../PostCard'

const PostPage = ({ id }) => {
  const [postInfo, setPostInfo] = React.useState(null)
  const [notFound, setNotFound] = React.useState(false)
  const [active, setActive] = useState('top')

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

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[650px]">
        {!postInfo && (
          <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
            <div className="w-full flex flex-row items-center space-x-4 p-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
              <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
              <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
            </div>
            <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
              <div className="w-6 sm:w-[50px] h-4 " />
              <div className="w-full mr-4 rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
            </div>
          </div>
        )}
        {notFound ? (
          <div className="flex items-center justify-center w-full bg-s-bg p-3 my-6 sm:rounded-3xl shadow-lg text-bold text-2xl">
            <h2>Post was deleted or does not exist</h2>
          </div>
        ) : (
          postInfo && (
            <div>
              <PostCard post={postInfo} setNotFound={setNotFound} />
              <CommentFilterNav active={active} setActive={setActive} />
              {active === 'top' && (
                <CombinedCommentSectionApiTop
                  postId={postInfo._id}
                  authorAddress={postInfo.authorAddress}
                />
              )}
              {active === 'new' && (
                <CombinedCommentSectionApiNew
                  postId={postInfo._id}
                  authorAddress={postInfo.authorAddress}
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default PostPage
