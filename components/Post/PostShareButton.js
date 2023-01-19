import React from 'react'
import { RWebShare } from 'react-web-share'
import { FiSend } from 'react-icons/fi'

const PostShareButton = ({ url, text }) => {
  const link = url || window.location.href
  const title = 'Share this post'

  return (
    <div>
      <RWebShare
        data={{
          url: link,
          title,
          text
        }}
      >
        <FiSend className="hover:cursor-pointer mr-3 w-5 h-5" />
      </RWebShare>
    </div>
  )
}

export default PostShareButton
