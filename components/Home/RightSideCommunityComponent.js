import Link from 'next/link'
// import { useRouter } from 'next/router'
import React from 'react'

const RightSideCommunityComponent = ({ community }) => {
  // const router = useRouter()
  return (
    <Link
      href={`/c/${community?.name}`}
      className="flex flex-row gap-2 items-center hover:bg-[#eee] rounded-full p-2"
    >
      <img
        src={
          community?.logoImageUrl ? community?.logoImageUrl : '/gradient.jpg'
        }
        className="w-[40px] h-[40px] bg-[#D9D9D9] rounded-full"
      />
      <span>{community?.name}</span>
    </Link>
  )
}
export default RightSideCommunityComponent
