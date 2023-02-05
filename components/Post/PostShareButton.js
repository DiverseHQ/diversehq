import React from 'react'
import { RWebShare } from 'react-web-share'

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
      <div
        className="flex flex-row items-center hover:bg-p-btn-hover rounded-md p-1"
        title="Share"
      >
        <img
          src="/share.svg"
          alt="Share"
          className="hover:cursor-pointer w-4 h-4 "
        />
      </div>
    </RWebShare>
  )
}

export default PostShareButton
