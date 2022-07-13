import { useRouter } from 'next/router'
import React from 'react'

const CommunityCard = ({ community }) => {
  const router = useRouter()
  return (
    <div className='flex flex-col max-w-[450px] text-p-text bg-s-bg'>
        <div onClick={() => {
          router.push(`/c/${community.name}`)
        }}>{community.name}</div>
        <div>{community.description}</div>
        <div>Memebers : {community.members.length}</div>
        <img src={community.bannerImageUrl} width="450px" />
        <img src={community.logoImageUrl} width="250px" />
    </div>
  )
}

export default CommunityCard
