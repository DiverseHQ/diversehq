import React, { useState } from 'react'
import CombinedCommentSectionApiNew from '../../Comment/CombinedCommentSectionApiNew'
import CombinedCommentSectionApiTop from '../../Comment/CombinedCommentSectionApiTop'
import CommentFilterNav from '../../Comment/CommentFilterNav'
import MobileLoader from '../../Common/UI/MobileLoader'
import useDevice from '../../Common/useDevice'
import PostCard from '../PostCard'

const PostPage = ({ post }) => {
  const [active, setActive] = useState('top')
  const { isMobile } = useDevice()

  return (
    <>
      <div className="w-full flex justify-center pb-[50px]">
        <div className="w-full md:w-[650px]">
          {!post &&
            (isMobile ? (
              <MobileLoader />
            ) : (
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
            ))}
          {post && (
            <div>
              <PostCard _post={post} />
              <CommentFilterNav active={active} setActive={setActive} />
              {active === 'top' && (
                <CombinedCommentSectionApiTop
                  postId={post._id}
                  authorAddress={post.authorAddress}
                />
              )}
              {active === 'new' && (
                <CombinedCommentSectionApiNew
                  postId={post._id}
                  authorAddress={post.authorAddress}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PostPage
