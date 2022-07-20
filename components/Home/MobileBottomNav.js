import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

const MobileBottomNav = () => {
  const router = useRouter()
  const routeToHome = () => {
    router.push('/')
  }
  const routeToExplore = () => {
    router.push('/explore')
  }
  const routeToNotifications = () => {
    router.push('/notifications')
  }
  const routeToNewPost = () => {
    router.push('/new-post')
  }
  const routeToSearch = () => {
    router.push('/search')
  }
  return (
    <div className="fixed bottom-0 w-full py-2.5 flex flex-row justify-evenly bg-p-bg">
        <Image src='/home.svg' width={25} height={25} onClick={routeToHome}/>
        <Image src='/explore.svg' width={25} height={25} onClick={routeToExplore}/>
        <Image src='/add.svg' width={35} height={35} onClick={routeToNewPost}/>
        <Image src='/search.svg' width={25} height={25} onClick={routeToSearch}/>
        <Image src='/bell.svg' width={25} height={25} onClick={routeToNotifications}/>
    </div>
  )
}

export default MobileBottomNav
