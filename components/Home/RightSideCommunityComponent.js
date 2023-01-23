import Link from 'next/link'
// import { useRouter } from 'next/router'
import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

const RightSideCommunityComponent = ({ community }) => {
  // const router = useRouter()
  return (
    <Link
      href={`/c/${community?.name}`}
      className="flex flex-row gap-2 items-center hover:bg-[#eee] rounded-full "
      passHref
    >
      <ImageWithPulsingLoader
        src={
          community?.logoImageUrl ? community?.logoImageUrl : '/gradient.jpg'
        }
        className="w-[40px] h-[40px] object-cover  rounded-full"
      />
      <span className="text-p-text">{community?.name}</span>
    </Link>
  )
}
export default RightSideCommunityComponent
