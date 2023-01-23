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
      <IoIosShareAlt className="hover:cursor-pointer w-6 h-6" />
    </RWebShare>
  )
}

export default PostShareButton
