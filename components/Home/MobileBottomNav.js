import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { AiFillPlusCircle, AiOutlineBell, AiOutlineHome } from 'react-icons/ai'
import { MdOutlineExplore } from 'react-icons/md'
import { BsSearch } from 'react-icons/bs'
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
    router.push('/submit')
  }
  const routeToSearch = () => {
    router.push('/search')
  }
  return (
    <div className="fixed bottom-0 w-full py-1.5 flex flex-row justify-evenly items-center bg-p-bg shadow-top">
        <AiOutlineHome className="w-7 h-7 " onClick={routeToHome} />
        <MdOutlineExplore className="w-7 h-7 " onClick={routeToExplore} />
        <AiFillPlusCircle className="w-10 h-10 text-p-btn" onClick={routeToNewPost} />
        <BsSearch className="w-6 h-6 " onClick={routeToSearch} />
        <AiOutlineBell className="w-7 h-7 " onClick={routeToNotifications} />
    </div>
  )
}

export default MobileBottomNav
