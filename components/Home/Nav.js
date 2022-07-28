import { useState, useContext, useEffect } from 'react'
import { useProfile } from '../Common/WalletContext'
import DiveToken from '../../utils/DiveTokens.json'
import { ethers } from 'ethers'
import CreatePostPopup from './CreatePostPopup'
import CreateCommunity from './CreateCommunity'
import ChangeMonkey from './ChangeMonkey.js'
import Router, { useRouter } from 'next/router'
import AddToken from "./AddToken"
import { useTheme } from 'next-themes'
import CreatePostButton from './CreatePostButton'
import Image from 'next/image'
import { MdOutlineExplore } from 'react-icons/md'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ClickOption from './ClickOption'

const Nav = () => {
  const { user } = useProfile()
  const [showOptions, setShowOptions] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { showModal, hideModal } = usePopUpModal();
  
  const routeToExplore = () => {
    router.push('/explore')
  }

  const routeToHome = () => {
    router.push('/')
  }

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal( 
      {
        component: <ClickOption />,
        type: modalType.customposition,
        onAction: () => {},
        extraaInfo: {
          bottom: window.innerHeight - e.currentTarget.getBoundingClientRect().top+ 10 + 'px',
          left: e.currentTarget.getBoundingClientRect().left + 'px'
        }
      }
    )
  }

  return (
    <>
    <div className="fixed top-0 left-24 pt-6 pb-14 flex flex-col justify-between items-center h-full">
        <div className="flex flex-col items-center">
          <div className='mb-7 hover:cursor-pointer' onClick={routeToHome}>
          <Image src="/logo.png" width="45" height="45" className='bg-s-text rounded-full'/>
          </div>
        <MdOutlineExplore className="w-12 h-12 mb-7 hover:cursor-pointer" onClick={routeToExplore}/>
        <CreatePostButton />
        

        </div>
        <div className='flex-end hover:cursor-pointer' onClick={showMoreOptions}>
          {user?.profileImageUrl && <Image src={user.profileImageUrl} width="48" height="48" className='rounded-full' />}
        </div>
    </div>

    {(showOptions && user) && <div className="fixed top-[0px] right-[5px] flex flex-col z-10">
      <ChangeMonkey />
      <CreateCommunity />
      <AddToken />
      </div>}
    </>
  )
}

export default Nav
