import React from 'react'

//ReactimeAgo

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

const CommonNotificationCardLayoutUI = ({ MainRow, Body, createdAt }) => {
  return (
    <div className="flex flex-col px-2 w-full">
      <div className="flex flex-row justify-between">
        <MainRow />
        <div className="items-end shrink-0 text-sm sm:text-base">
          <ReactTimeAgo date={createdAt} locale="en-US" />
        </div>
      </div>
      <Body />
    </div>
  )
}

export default CommonNotificationCardLayoutUI
