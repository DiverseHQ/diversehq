import Link from 'next/link'
// import { useRouter } from 'next/router'
import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

const RightSideCommunityComponent = ({ community }) => {
  // const router = useRouter()
  return (
    <Link
      href={`/c/${community?.name}`}
      className="flex flex-row gap-2 items-center text-p-text hover:bg-p-hover hover:text-p-hover-text rounded-[15px]"
      passHref
    >
      <ImageWithPulsingLoader
        src={
          community?.logoImageUrl ? community?.logoImageUrl : '/gradient.jpg'
        }
        className="w-[40px] h-[40px] object-cover  rounded-full"
      />
      <span>{community?.name}</span>
    </Link>
  )
}
export default RightSideCommunityComponent
