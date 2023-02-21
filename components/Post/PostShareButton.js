import React from 'react'
import { RWebShare } from 'react-web-share'
import { Tooltip } from '@mui/material'

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
      <Tooltip enterDelay={1000} leaveDelay={200} title="Share" arrow>
        <div className="flex flex-row items-center hover:bg-s-hover rounded-md p-1">
          <img
            src="/share.svg"
            alt="Share"
            className="hover:cursor-pointer w-4 h-4 sm:w-[18px] sm:h-[18px] "
          />
        </div>
      </Tooltip>
    </RWebShare>
  )
}

export default PostShareButton
