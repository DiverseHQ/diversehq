import Link from 'next/link'
import React from 'react'
import { stringToLength } from '../../../utils/utils'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'

interface Props {
  fromAvatarUrl: string
  toAvatarUrl: string
  toHandle: string
  toContent: string
}

const ReplyMobileInfo = ({
  fromAvatarUrl,
  toAvatarUrl,
  toHandle,
  toContent
}: Props) => {
  return (
    <div className="px-2 sm:px-5 w-full bg-s-bg pb-2 flex flex-row justify-between items-center">
      <div className="flex flex-row w-full space-x-4 items-center">
        <ImageWithPulsingLoader
          src={fromAvatarUrl}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <Link href={`/u/${toHandle}`} passHref>
            <div className="text-base">
              Replying to{' '}
              <span className="hover:underline font-bold">u/{toHandle}</span>
            </div>
          </Link>
          <div className="text-[14px]">{stringToLength(toContent, 20)}</div>
        </div>
        <ImageWithPulsingLoader
          src={toAvatarUrl}
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>
  )
}

export default ReplyMobileInfo
