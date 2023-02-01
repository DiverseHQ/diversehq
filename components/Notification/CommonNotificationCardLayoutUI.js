import React from 'react'

//ReactimeAgo

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

const CommonNotificationCardLayoutUI = ({ MainRow, Body, createdAt, icon }) => {
  return (
    <div className="flex flex-col px-2 w-full">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-row gap-4 items-start">
          <div className="pt-1.5 text-[16px]">
            {icon?.name && <icon.name />}
          </div>
          <div className="flex flex-col">
            <MainRow />
            <Body />
          </div>
        </div>
        <div className="items-end shrink-0 text-sm sm:text-base">
          <ReactTimeAgo date={createdAt} locale="en-US" />
        </div>
      </div>
    </div>
  )
}

export default CommonNotificationCardLayoutUI
