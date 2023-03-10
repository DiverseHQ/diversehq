import Link from 'next/link'
import React from 'react'

//ReactimeAgo

import ReactTimeAgo from 'react-time-ago'

interface Props {
  MainRow: React.FC
  Body: React.FC
  createdAt: string
  Icon: React.FC
  isRead: boolean
  cardLink: string
}

const CommonNotificationCardLayoutUI = ({
  MainRow,
  Body,
  createdAt,
  Icon,
  isRead,
  cardLink
}: Props) => {
  return (
    <Link href={cardLink}>
      <div className="flex flex-col px-2 w-full relative">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-row gap-4 items-start">
            <div className="pt-1.5 text-[16px]">
              {typeof Icon === 'function' && <Icon />}
            </div>
            <div className="flex flex-col">
              <MainRow />
              <Body />
            </div>
          </div>
          <div className="items-end shrink-0 text-sm sm:text-base pl-1">
            <ReactTimeAgo
              timeStyle="twitter"
              date={new Date(createdAt)}
              locale="en-US"
            />
          </div>
        </div>
        {!isRead && (
          <div className="absolute top-0 right-0 h-2 w-2 bg-p-btn rounded-full z-30 animate-pulse" />
        )}
      </div>
    </Link>
  )
}

export default CommonNotificationCardLayoutUI
