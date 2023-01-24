import React from 'react'
import { RWebShare } from 'react-web-share'
import { IoIosShareAlt } from 'react-icons/io'

const PostShareButton = ({ url, text }) => {
  const link = url || window.location.href
  const title = 'Share this post'

  return (
    <RWebShare
      data={{
        url: link,
        title,
        text
      }}
    >
      <div className="hover:bg-p-btn-hover rounded-md p-1">
        <IoIosShareAlt className="hover:cursor-pointer w-6 h-6 " />
      </div>
    </RWebShare>
  )
}

export default PostShareButton
