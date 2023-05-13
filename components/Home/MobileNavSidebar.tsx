import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
// import { IoIosClose } from 'react-icons/io'
// import { IoIosHelpCircleOutline } from 'react-icons/io'
// import { BsMoon } from 'react-icons/bs'
// import { AiOutlineGift } from 'react-icons/ai'
// import { MdOutlineGroups } from 'react-icons/md'
// import CreateCommunity from './CreateCommunity'
import { MdCreateNewFolder, MdOutlineGroups } from 'react-icons/md'
import CreateCommunity from './CreateCommunity'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import LensLoginButton from '../Common/LensLoginButton'
import { stringToLength } from '../../utils/utils'
import { FaDiscord, FaRegCopy } from 'react-icons/fa'
import { DISCORD_INVITE_LINK } from '../../utils/config'
import { useDisconnect } from 'wagmi'
import {
  getCreatedCommunitiesApi,
  getJoinedCommunitiesApi
} from '../../apiHelper/community'
import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import {
  AiOutlineUsergroupAdd,
  AiOutlineDisconnect,
  AiOutlineTwitter
} from 'react-icons/ai'
import { useTheme } from '../Common/ThemeProvider'
import { useLensUserContext } from '../../lib/LensUserContext'
import getAvatar from '../User/lib/getAvatar'
import { IoIosMoon, IoMdSettings } from 'react-icons/io'
import { HiSun } from 'react-icons/hi'
import formatHandle from '../User/lib/formatHandle'
import CreateLensCommunityPopUp from './CreateLensCommunityPopUp'
import VerifiedBadge from '../Common/UI/Icon/VerifiedBadge'
import Link from 'next/link'
import { BsFillPersonFill } from 'react-icons/bs'
import getIPFSLink from '../User/lib/getIPFSLink'

const MobileNavSidebar = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const router = useRouter()
  const { user, address, LensCommunity, joinedLensCommunities } = useProfile()
  const { notifyInfo, notifyError } = useNotify()
  const { showModal } = usePopUpModal()
  const { disconnect } = useDisconnect()
  const [createdCommunities, setCreatedCommunities] = useState([])
  const [showCreatedCommunities, setShowCreatedCommunities] = useState(false)
  const createdCommunitiesButtonRef = useRef(null)
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [showJoinedCommunities, setShowJoinedCommunities] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { data: myLensProfile, isSignedIn, hasProfile } = useLensUserContext()

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
    getJoinedCommunities()
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

  const createLensCommunity = () => {
    showModal({
      component: <CreateLensCommunityPopUp />,
      type: modalType.fullscreen
    })
  }

  const routeToProfile = () => {
    if (!myLensProfile?.defaultProfile) {
      notifyInfo('You might want to login first')
      return
    }
    router.push(`/u/${formatHandle(myLensProfile?.defaultProfile?.handle)}`)
  }

  const handleWalletAddressCopy = () => {
    if (!user?.walletAddress) {
      notifyInfo('Please Login')
      return
    }
    navigator.clipboard.writeText(user?.walletAddress)
    notifyInfo('Copied to clipboard')
  }

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    try {
      const response = await getJoinedCommunitiesApi()
      setJoinedCommunities(response)
    } catch (error) {
      console.log('error', error)
      notifyError('Error getting joined communities')
    }
  }

  const sortedJoinedLensCommunities = joinedLensCommunities?.sort(
    (a, b) => b.stats.totalFollowers - a.stats.totalFollowers
  )

  return (
    <>
      <BottomDrawerWrapper
        isDrawerOpen={isOpenSidebar}
        setIsDrawerOpen={setIsOpenSidebar}
        position="left"
      >
        <div className="flex flex-col absolute transition ease-in-out h-full bg-s-bg dark:text-p-text w-full justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between px-4 pt-4 gap-2 mb-6">
              {isSignedIn && hasProfile && user && (
                <div className="flex flex-col">
                  <div className="flex flex-row gap-1">
                    <ImageWithPulsingLoader
                      // @ts-ignore
                      src={getAvatar(myLensProfile?.defaultProfile)}
                      className="w-[55px] h-[55px] bg-[#333] rounded-full"
                      onClick={() => {
                        setIsOpenSidebar(false)
                        routeToProfile()
                      }}
                    />
                    <div className="flex flex-col items-start justify-center ml-4">
                      {myLensProfile?.defaultProfile?.name && (
                        <div className="font-semibold">
                          {stringToLength(
                            myLensProfile?.defaultProfile?.name,
                            20
                          )}
                        </div>
                      )}
                      <div className="text-s-text">
                        u/
                        {stringToLength(
                          formatHandle(myLensProfile?.defaultProfile?.handle),
                          20
                        )}
                      </div>

                      <div className="flex flex-row gap-4 text-p-text">
                        <div className="">
                          <span className="font-bold mr-1">
                            {
                              myLensProfile?.defaultProfile?.stats
                                ?.totalFollowers
                            }
                          </span>
                          <span className="font-light">Followers</span>
                        </div>
                        <div className="">
                          <span className="font-bold mr-1">
                            {
                              myLensProfile?.defaultProfile?.stats
                                ?.totalFollowing
                            }
                          </span>
                          <span className="font-light">Following</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {(!isSignedIn || !hasProfile || !user) && (
              <div className="px-4 mb-2">
                <LensLoginButton />
              </div>
            )}
            <div className="flex flex-col px-4">
              <Link
                href={`/u/${formatHandle(
                  myLensProfile?.defaultProfile?.handle
                )}`}
                onClick={() => {
                  setIsOpenSidebar(false)
                }}
                className="flex flex-row items-center pb-4 pt-2 gap-4"
              >
                <BsFillPersonFill className="w-7 h-7 object-contain" />
                <span className="text-p-text text-xl">Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => {
                  setIsOpenSidebar(false)
                }}
                className="flex flex-row items-center py-4 gap-4"
              >
                <IoMdSettings className="w-7 h-7 object-contain" />
                <span className="text-p-text text-xl">Settings</span>
              </Link>
              <div className="h-[2px] bg-[#eee] dark:bg-p-border" />
              <button
                className="flex flex-row items-center   py-4 gap-4"
                onClick={() => {
                  createCommunity()
                  setIsOpenSidebar(false)
                }}
              >
                <MdCreateNewFolder className="w-7 h-7 object-contain" />
                <span className="text-p-text text-xl">Create Community</span>
              </button>{' '}
              {!LensCommunity && (
                <button
                  className="flex flex-row items-center   py-4 gap-4"
                  onClick={() => {
                    createLensCommunity()
                    setIsOpenSidebar(false)
                  }}
                >
                  <MdCreateNewFolder className="w-7 h-7 object-contain" />
                  <span className="text-p-text text-xl">
                    Create Lens Community
                  </span>
                </button>
              )}
              <button
                className="flex flex-row items-center   py-4 gap-4"
                onClick={() => {
                  setShowCreatedCommunities(true)
                }}
                ref={createdCommunitiesButtonRef}
              >
                <AiOutlineUsergroupAdd className="w-7 h-7 object-contain" />
                <span className="text-p-text text-xl">Created Communities</span>
              </button>
              <button
                className="flex flex-row items-center   py-4 gap-4"
                onClick={() => setShowJoinedCommunities(true)}
                ref={createdCommunitiesButtonRef}
              >
                <MdOutlineGroups className="w-7 h-7 object-contain" />
                <span className="text-p-text text-xl">Joined Communities</span>
              </button>
              <div className="h-[2px] bg-[#eee] dark:bg-p-border" />
              <button
                className="flex flex-row items-center  py-4 gap-4"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <IoIosMoon className="w-7 h-7 object-contain" />
                ) : (
                  <HiSun className="w-7 h-7 object-contain" />
                )}
                <span className="text-p-text text-xl">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>
              <div className="flex flex-row items-center  py-4 gap-4">
                <div
                  className="flex flex-row gap-4"
                  onClick={async () => {
                    disconnect()
                    setIsOpenSidebar(false)
                  }}
                >
                  <AiOutlineDisconnect className="w-7 h-7 object-contain text-red-400" />
                  <span className="text-xl text-red-400">Disconnect</span>
                </div>
                {user && address && (
                  <div
                    className="text-sm flex flex-row items-center cursor-pointer"
                    onClick={handleWalletAddressCopy}
                  >
                    <div className="">
                      {stringToLength(user?.walletAddress, 8)}
                    </div>
                    <FaRegCopy className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="h-[2px] bg-[#eee] dark:bg-p-border" />
            </div>
          </div>
          <div>
            <div className="p-4 text-xs text-s-text">
              App is in beta and things might break. Report bugs or request
              features on Discord.
            </div>
            <div className="flex flex-row flex-wrap gap-x-4 items-center px-4 pb-4">
              <a
                href={DISCORD_INVITE_LINK}
                target={'_blank'}
                rel="noreferrer"
                className="flex flex-row items-center gap-4 py-1 px-3 rounded-full bg-p-bg"
              >
                <FaDiscord className="w-4 h-4" />
                <span className="text-p-text">Discord</span>
              </a>
              <a
                href={DISCORD_INVITE_LINK}
                target={'_blank'}
                rel="noreferrer"
                className="flex flex-row items-center gap-4 py-1 px-3 rounded-full bg-p-bg"
              >
                <AiOutlineTwitter className="w-4 h-4" />
                <span className="text-p-text">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </BottomDrawerWrapper>

      {/* joined communities here */}

      <BottomDrawerWrapper
        isDrawerOpen={showJoinedCommunities}
        setIsDrawerOpen={setShowJoinedCommunities}
        position="bottom"
      >
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-lg mt-5">Joined Communities</h1>
          <div className="rounded-md sm:rounded-xl max-h-[300px] overflow-y-auto overflow-x-hidden self-start no-scrollbar w-screen ">
            {joinedCommunities &&
              [
                ...sortedJoinedLensCommunities
                  .map((community) => ({
                    _id: community._id,
                    name: formatHandle(community?.handle),
                    // @ts-ignore
                    logoImageUrl: getAvatar(community),
                    isLensCommunity: true,
                    verified: community?.verified
                  }))
                  .sort(
                    (a, b) =>
                      // @ts-ignore
                      b?.stats?.totalFollowers - a?.stats?.totalFollowers
                  ),
                ...joinedCommunities
              ].map((community) => (
                <div
                  key={community._id}
                  className="flex flex-row space-x-2 items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn-hover mx-4"
                  id={community._id}
                  onClick={() => {
                    if (community?.isLensCommunity) {
                      router.push(`/l/${formatHandle(community?.handle)}`)
                    } else {
                      router.push(`/c/${community.name}`)
                    }
                    setIsOpenSidebar(false)
                  }}
                >
                  <ImageWithPulsingLoader
                    src={community.logoImageUrl ?? '/gradient.jpg'}
                    alt="community logo"
                    className="rounded-full object-cover w-12 h-12"
                  />
                  <div
                    className="text-p-text pl-1 text-lg font-semibold"
                    id={community._id}
                  >
                    {community?.isLensCommunity
                      ? `l/${community?.name}`
                      : community.name}
                  </div>
                  {community?.verified && <VerifiedBadge className="w-4 h-4" />}
                </div>
              ))}
          </div>
        </div>
      </BottomDrawerWrapper>

      {/* created communities here */}

      <BottomDrawerWrapper
        isDrawerOpen={showCreatedCommunities}
        setIsDrawerOpen={setShowCreatedCommunities}
        showClose={true}
        position="bottom"
      >
        <div className="flex flex-col justify-center items-center ">
          <h1 className="font-bold text-lg mt-5">Created Communities</h1>
          <div className=" rounded-md sm:rounded-xl max-h-[300px] overflow-y-auto overflow-x-hidden self-start no-scrollbar w-screen ">
            {LensCommunity && (
              <div
                className="flex flex-row space-x-2 items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn-hover mx-4"
                onClick={() => {
                  router.push(
                    `/l/${formatHandle(LensCommunity?.Profile?.handle)}`
                  )
                  setIsOpenSidebar(false)
                }}
              >
                <ImageWithPulsingLoader
                  src={getAvatar(LensCommunity?.Profile)}
                  alt="community logo"
                  className="rounded-full object-cover w-12 h-12"
                />

                <div className="text-p-text ml-2 text-lg font-semibold">
                  l/{formatHandle(LensCommunity?.Profile?.handle)}
                </div>

                {LensCommunity?.verified && (
                  <VerifiedBadge className="w-4 h-4" />
                )}
              </div>
            )}

            {createdCommunities.map((community) => (
              <div
                key={community._id}
                className="flex flex-row space-x-2 items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn-hover mx-4"
                id={community._id}
                onClick={() => {
                  router.push(`/c/${community.name}`)
                  setIsOpenSidebar(false)
                }}
              >
                <ImageWithPulsingLoader
                  src={
                    community.logoImageUrl
                      ? getIPFSLink(community.logoImageUrl)
                      : '/gradient.jpg'
                  }
                  alt="community logo"
                  className="rounded-full object-cover w-12 h-12"
                />

                <div
                  className="text-p-text ml-2 text-lg font-semibold"
                  id={community._id}
                >
                  {community.name}
                </div>

                {community?.verified && <VerifiedBadge className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </div>
      </BottomDrawerWrapper>
    </>
  )
}

export default MobileNavSidebar
