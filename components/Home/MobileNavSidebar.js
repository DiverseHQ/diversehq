import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { IoIosClose } from 'react-icons/io'
// import { IoIosHelpCircleOutline } from 'react-icons/io'
// import { BsMoon } from 'react-icons/bs'
// import { AiOutlineGift } from 'react-icons/ai'
import {
  MdOutlineCreateNewFolder,
  MdOutlineGroups,
  MdOutlinePerson
} from 'react-icons/md'
import CreateCommunity from './CreateCommunity'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import LensLoginButton from '../Common/LensLoginButton'
import { stringToLength } from '../../utils/utils'
import { FaDiscord, FaRegCopy } from 'react-icons/fa'
import { DISCORD_INVITE_LINK } from '../../utils/config'
import { useDisconnect } from 'wagmi'
import { getCreatedCommunitiesApi } from '../../api/community'

const MobileNavSidebar = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const router = useRouter()
  const { user, address } = useProfile()
  const { notifyInfo, notifyError } = useNotify()
  const { showModal } = usePopUpModal()
  const { disconnect } = useDisconnect()
  const [createdCommunities, setCreatedCommunities] = useState([])
  const [showCreatedCommunities, setShowCreatedCommunities] = useState(false)
  const dropdownRef = useRef(null)
  const createdCommunitiesButtonRef = useRef(null)

  useEffect(() => {
    const handleClick = (event) => {
      // Check if the target element of the click is the dropdown element
      // or a descendant of the dropdown element
      console.log('showCreatedCommunities', showCreatedCommunities)
      if (!dropdownRef?.current) return
      if (
        !dropdownRef.current.contains(event.target) &&
        !createdCommunitiesButtonRef.current.contains(event.target)
      ) {
        // Hide the dropdown
        setShowCreatedCommunities(false)
      }
    }
    document.addEventListener('click', handleClick)

    // if (!dropdownRef?.current) return
    // if (!showCreatedCommunities) {
    //   document.removeEventListener('click', handleClick)
    // } else {
    //   document.addEventListener('click', handleClick)
    // }
    // Add the event listener
    // document.addEventListener('click', handleClick)

    // Remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [dropdownRef])

  const fetchAndSetCreatedCommunities = async () => {
    try {
      const communities = await getCreatedCommunitiesApi()
      if (communities.length > 0) {
        setCreatedCommunities(communities)
      }
    } catch (error) {
      console.log(error)
      notifyError("Couldn't fetch created communities")
    }
  }

  useEffect(() => {
    if (!user) return
    fetchAndSetCreatedCommunities()
  }, [user])

  const createCommunity = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You shall not pass, without login first')
      return
    }
    showModal({
      component: <CreateCommunity />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  const routeToProfile = () => {
    if (!address) {
      notifyInfo('You might want to login first')
      return
    }
    router.push(`/u/${address}`)
  }

  const handleWalletAddressCopy = () => {
    if (!user?.walletAddress) {
      notifyInfo('Please Login')
      return
    }
    navigator.clipboard.writeText(user?.walletAddress)
    notifyInfo('Copied to clipboard')
  }

  useEffect(() => {
    console.log('showCreatedCommunities', showCreatedCommunities)
  }, [showCreatedCommunities])

  return (
    <div
      className={`text-black z-0 fixed top-0 left-0 right-0 bottom-0 w-full overflow-hidden ${
        isOpenSidebar ? 'z-20' : ''
      }`}
    >
      {/* backdrop */}
      {isOpenSidebar && (
        <div
          className="absolute bg-black/20 top-0 right-0 left-0 bottom-0 w-full"
          onClick={() => {
            setIsOpenSidebar(false)
          }}
        />
      )}

      <div
        className={` flex flex-col absolute transition ease-in-out w-[80%] h-full duration-3000 bg-p-bg border gap-4 ${
          isOpenSidebar ? 'top-0 ' : 'top-[-490px]'
        } `}
      >
        <div className="flex flex-row justify-between px-4 pt-4 gap-2">
          {user && address && (
            <div className="flex flex-col gap-1">
              <img
                src={user?.profileImageUrl}
                className="w-[55px] h-[55px] bg-[#333] rounded-full"
              />
              {user?.name && (
                <h3 className="font-semibold text-[18px]">{user.name}</h3>
              )}
              <div
                className="text-sm flex flex-row items-center cursor-pointer"
                onClick={handleWalletAddressCopy}
              >
                <div className="">{stringToLength(user.walletAddress, 8)}</div>
                <FaRegCopy className="w-7 h-7 px-2" />
              </div>
              <span className="text-[14px] text-s-text">
                Joined {user.communities.length} Communities
              </span>
              <div onClick={disconnect}>Disconnect</div>
            </div>
          )}
          <div className="jutify-end">
            <button onClick={() => setIsOpenSidebar(!isOpenSidebar)}>
              <IoIosClose className="w-[40px] h-[40px]" />
            </button>
          </div>
        </div>
        <div className="flex flex-col px-4 bg-p-bg">
          <LensLoginButton />

          <button
            className="flex flex-row items-center  hover:font-semibold py-4 gap-2"
            onClick={() => {
              routeToProfile()
              setIsOpenSidebar(false)
            }}
          >
            <MdOutlinePerson className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text ">Profile</span>
          </button>
          <div className="flex flex-col">
            <button
              className="flex flex-row items-center  hover:font-semibold py-4 gap-2"
              onClick={() => {
                console.log('clicked')
                setShowCreatedCommunities(true)
              }}
              ref={createdCommunitiesButtonRef}
            >
              <MdOutlineGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
              <span className="text-p-text ">Your Communities</span>
            </button>
            <div
              className="bg-s-bg rounded-md sm:rounded-xl absolute mt-7 z-50 max-h-[300px] overflow-y-auto overflow-x-hidden"
              ref={dropdownRef}
            >
              {showCreatedCommunities &&
                createdCommunities.map((community) => (
                  <div
                    key={community._id}
                    className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn"
                    id={community._id}
                    onClick={() => {
                      router.push(`/c/${community.name}`)
                      setIsOpenSidebar(false)
                    }}
                  >
                    <img
                      src={
                        community.logoImageUrl
                          ? community.logoImageUrl
                          : '/gradient.jpg'
                      }
                      alt="community logo"
                      className="rounded-md sm:rounded-xl w-9 h-9"
                    />
                    <div className="text-p-text ml-4" id={community._id}>
                      {community.name}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <button
            className="flex flex-row items-center  hover:font-semibold py-4 gap-2"
            onClick={() => {
              createCommunity()
              setIsOpenSidebar(false)
            }}
          >
            <MdOutlineCreateNewFolder className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            <span className="text-p-text">Create Community</span>
          </button>
          {/* <button className="flex flex-row items-center  hover:font-semibold py-4 gap-2">
            <AiOutlineGift className="w-[24px] h-[24px] object-contain" />
            <span className="text-p-text">XP Gift</span>
          </button> */}
          <a
            href={DISCORD_INVITE_LINK}
            target={'_blank'}
            rel="noreferrer"
            className="flex flex-row items-center gap-2 py-4  hover:font-semibold"
          >
            <FaDiscord className="w-[20px] h-[20px]" />
            <span className="text-p-text ">Discord</span>
          </a>
        </div>

        {/* <div className="flex flex-col px-4">
          <button className="flex flex-row items-center gap-2 py-4  hover:font-semibold">
            <BsMoon className="w-[20px] h-[20px]" />
            <span className="text-p-text">Dark Mode</span>
          </button>
          <button className="flex flex-row items-center gap-2 py-4  hover:font-semibold">
            <IoIosHelpCircleOutline className="w-[20px] h-[20px]" />
            <span className="text-p-text">Help Center</span>
          </button>
          <a
            href={DISCORD_INVITE_LINK}
            target={'_blank'}
            rel="noreferrer"
            className="flex flex-row items-center gap-2 py-4  hover:font-semibold"
          >
            <FaDiscord className="w-[20px] h-[20px]" />
            <span className="text-p-text ">Discord</span>
          </a>
        </div> */}
      </div>
    </div>
  )
}

export default MobileNavSidebar
