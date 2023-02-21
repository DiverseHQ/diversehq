import Link from 'next/link'
import React, { useEffect, useState } from 'react'
// import { FaRegCopy } from 'react-icons/fa'
import { getNumberOfPostsUsingUserAddress } from '../../../api/post'
import { getUserInfo } from '../../../api/user'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { modalType, usePopUpModal } from '../../Common/CustomPopUpProvider'
// import { useNotify } from '../../Common/NotifyContext'
import { useProfile } from '../../Common/WalletContext'
import LensPostsProfilePublicationsColumn from '../../Post/LensPostsProfilePublicationsColumn'
import PostsColumn from '../../Post/PostsColumn'
import EditProfile from '../EditProfile'
import useDevice from '../../Common/useDevice'
import { GiBreakingChain } from 'react-icons/gi'
import { useProfileQuery } from '../../../graphql/generated'
import { HiCollection } from 'react-icons/hi'
import LensCollectedPublicationsColumn from '../../Post/LensCollectedPublicationsColumn'
import { useRouter } from 'next/router'
import { BiArrowBack, BiChevronDown, BiRepost } from 'react-icons/bi'
import BottomDrawerWrapper from '../../Common/BottomDrawerWrapper'
import { BsCollection } from 'react-icons/bs'
import { MdOutlineGroups } from 'react-icons/md'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import getStampFyiURL from '../lib/getStampFyiURL'
import { CiMail } from 'react-icons/ci'
import useXmtpClient from '../../Messages/hooks/useXmtpClient'
import { CircularProgress } from '@mui/material'
import { useMessageStore } from '../../../store/message'
import { buildConversationKey } from '../../Messages/lib/conversationKey'
import buildConversationId from '../../Messages/lib/buildConversationId'
import useLensFollowButton from '../useLensFollowButton'

const ProfilePage = ({ _profile, _lensProfile }) => {
  const [profile, setProfile] = useState(_profile)
  const [lensProfile, setLensProfile] = useState(_lensProfile)
  // const { notifyInfo } = useNotify()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()
  const [numberOfPosts, setNumberOfPosts] = useState(0)
  const { isMobile } = useDevice()
  const [active, setActive] = useState('lens')
  const router = useRouter()
  const { pathname } = router
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { client, initXmtpClient, loading } = useXmtpClient()
  const setMessageProfiles = useMessageStore(
    (state) => state.setMessageProfiles
  )
  const messageProfiles = useMessageStore((state) => state.messageProfiles)
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  )
  const setIsOpen = useMessageStore((state) => state.setIsOpen)

  const { FollowButton, isFollowedByMe } = useLensFollowButton({
    profileId: lensProfile?.id
  })

  useEffect(() => {
    if (pathname.endsWith('/lens')) {
      setActive('lens')
    } else if (pathname.endsWith('/offchain')) {
      setActive('offchain')
    } else if (pathname.endsWith('/collected')) {
      setActive('collected')
    } else {
      setActive('lens')
    }
  }, [pathname])

  const { data, refetch } = useProfileQuery(
    {
      request: {
        profileId: _lensProfile?.id
      }
    },
    {
      enabled: !!myLensProfile?.id
    }
  )

  useEffect(() => {
    if (data?.profile) {
      setLensProfile(data.profile)
    }
  }, [data])

  useEffect(() => {
    if (_profile) {
      setProfile(_profile)
    }
    if (_lensProfile) {
      refetch()
    }
  }, [_profile?._id, _lensProfile?.id])

  const getNumberOfPosts = async (address) => {
    try {
      const result = await getNumberOfPostsUsingUserAddress(address)
      setNumberOfPosts(result.numberOfPosts)
    } catch (error) {
      console.log(error)
    }
  }

  const showUserInfoFromAddress = async () => {
    try {
      if (!profile.walletAddress) return
      const userInfo = await getUserInfo(profile.walletAddress)
      setProfile(userInfo)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (profile.walletAddress) {
      getNumberOfPosts(profile.walletAddress)
    }
  }, [profile.walletAddress])

  // const handleWalletAddressCopy = () => {
  //   navigator.clipboard.writeText(profile.walletAddress)
  //   notifyInfo('Copied to clipboard')
  // }

  const handleEditProfile = () => {
    showModal({
      component: (
        <EditProfile user={user} showUserInfo={showUserInfoFromAddress} />
      ),
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  const handleDmClick = async () => {
    if (!client) {
      await initXmtpClient()
    }
    const newMessagesProfile = new Map(messageProfiles)
    const peerAddress = lensProfile?.ownedBy
    const key = buildConversationKey(
      peerAddress,
      buildConversationId(myLensProfile?.defaultProfile?.id, lensProfile.id)
    )
    newMessagesProfile.set(key, lensProfile)
    setMessageProfiles(newMessagesProfile)
    setConversationKey(key)
    setIsOpen(true)
  }

  return (
    <div>
      <>
        <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm sticky top-0 w-full z-30 min-h-[50px] bg-s-bg">
          <div className="h-[32px] flex flex-row items-center gap-3 text-[18px]">
            <div className="flex items-center justify-center w-8 h-8 hover:bg-p-btn-hover rounded-full">
              <BiArrowBack
                onClick={() => router.back()}
                className="w-6 h-6 rounded-full cursor-pointer"
              />
            </div>
            <span className="font-bold text-[20px]">Profile</span>
          </div>
        </div>
      </>
      {profile && (
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[650px]">
            <div className={`relative ${!isMobile ? 'mt-10' : ''}`}>
              <ImageWithFullScreenZoom
                className={`h-28 w-full object-cover ${
                  !isMobile
                    ? 'rounded-t-[20px] border-t-[1px] border-x-[1px] border-p-border'
                    : ''
                }`}
                src={
                  profile.bannerImageUrl
                    ? profile.bannerImageUrl
                    : '/gradient.jpg'
                }
              />

              <ImageWithFullScreenZoom
                className="absolute top-[-30px] left-3 sm:left-5 border-s-bg border-4 rounded-full bg-s-bg w-20 h-20"
                src={
                  profile?.profileImageUrl
                    ? profile?.profileImageUrl
                    : getStampFyiURL(profile?.walletAddress)
                }
              />

              <div
                className={`flex flex-col px-3 sm:px-5 pb-6 bg-s-bg ${
                  !isMobile
                    ? 'rounded-b-[20px] border-x-[1px] border-b-[1px] border-p-border'
                    : ''
                }`}
              >
                <div className="ml-24 flex flex-row justify-end md:justify-between items-start">
                  {!isMobile && (
                    <div className="flex flex-row items-start justify-between sm:space-x-10 mt-1 mb-2">
                      <div className="flex flex-col items-start font-bold text-base sm:text-base tracking-wider">
                        {profile.name && <div>{profile.name}</div>}
                        {!profile.name && profile.walletAddress && (
                          <div>
                            {profile.walletAddress.substring(0, 6) + '...'}
                          </div>
                        )}
                        {lensProfile?.handle && (
                          <Link
                            href={`/u/${lensProfile?.handle}`}
                            className="hover:underline cursor-pointer"
                            passHref
                          >
                            u/{lensProfile?.handle}
                          </Link>
                        )}
                        <div className="font-normal">{profile.bio}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-row items-start my-2 md:my-3 px-2 py-1">
                    {hasProfile &&
                      isSignedIn &&
                      myLensProfile &&
                      lensProfile &&
                      lensProfile.ownedBy?.toLowerCase() !==
                        user?.walletAddress?.toLowerCase() && (
                        <div className="mx-2">
                          <FollowButton />
                        </div>
                      )}
                    {user &&
                      user?.walletAddress.toLowerCase() ===
                        profile.walletAddress.toLowerCase() && (
                        <div
                          className="text-base text-p-btn-text bg-p-btn px-3 py-0.5 mx-2 rounded-md cursor-pointer"
                          onClick={handleEditProfile}
                        >
                          Edit
                        </div>
                      )}
                    {lensProfile &&
                      isSignedIn &&
                      hasProfile &&
                      lensProfile.ownedBy !==
                        myLensProfile?.defaultProfile.ownedBy &&
                      isFollowedByMe && (
                        <div
                          className="p-1 rounded-xl cursor-pointer hover:bg-p-btn-hover flex flex-row items-center space-x-1"
                          onClick={handleDmClick}
                        >
                          {!loading && <CiMail className="w-6 h-6" />}
                          {loading && (
                            <CircularProgress size="18px" color="primary" />
                          )}
                        </div>
                      )}
                  </div>
                </div>
                {isMobile && (
                  <>
                    <div className="flex flex-row items-start justify-start space-x-10">
                      <div className="flex flex-col items-start font-bold text-base sm:text-base tracking-wider">
                        {profile.name && <div>{profile.name}</div>}
                        {!profile.name && profile.walletAddress && (
                          <div>
                            {profile.walletAddress.substring(0, 6) + '...'}
                          </div>
                        )}
                        {lensProfile?.handle && (
                          <Link
                            href={`/u/${lensProfile?.handle}`}
                            className="hover:underline cursor-pointer"
                            passHref
                          >
                            u/{lensProfile?.handle}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div>{profile.bio}</div>
                  </>
                )}
                {isMobile ? (
                  <div className="flex flex-row flex-wrap gap-x-2 gap-y-2 mt-4 items-center text-[14px]">
                    {/* onchain lens data */}
                    {lensProfile && (
                      <>
                        <div className="flex flex-col items-center bg-s-h-bg py-1 px-2 sm:px-4 rounded-[10px] dark:bg-p-bg">
                          <span className="font-bold">
                            {lensProfile?.stats?.totalFollowers}
                          </span>
                          <span className="font-light">Followers</span>
                        </div>
                        <div className="flex flex-col items-center bg-s-h-bg py-1 px-2 sm:px-4 rounded-[10px] dark:bg-p-bg">
                          <span className="font-bold">
                            {lensProfile?.stats?.totalFollowing}
                          </span>
                          <span className="font-light">Following</span>
                        </div>
                        <div className="flex flex-col items-center bg-[#62F030] py-1 px-2 sm:px-4 rounded-[10px] text-ap-text dark:bg-p-bg">
                          <span className="font-bold">
                            {lensProfile?.stats?.totalPosts}
                          </span>
                          <span className="font-light">LensPosts</span>
                        </div>
                      </>
                    )}

                    <div
                      className="flex flex-col items-center bg-s-h-bg py-1 px-2 sm:px-4 rounded-[10px] dark:bg-p-bg cursor-pointer"
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      <span className="font-semibold">
                        <BiChevronDown className="text-[18px]" />
                      </span>
                      <span className="font-light">More</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 mt-3 items-center text-[14px]">
                    <div className="">
                      <span className="">Joined </span>
                      <span className="">Communities: </span>
                      <span className="font-semibold">
                        {profile?.communities?.length}
                      </span>
                    </div>
                    <div className="">
                      {lensProfile ? (
                        <span>
                          Posts :{' '}
                          <span className="font-semibold">
                            {Number(
                              numberOfPosts + lensProfile?.stats?.totalPosts
                            )}
                          </span>
                        </span>
                      ) : (
                        <span>
                          Posts:{' '}
                          <span className="font-semibold">{numberOfPosts}</span>
                        </span>
                      )}
                    </div>
                    {/* <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full dark:bg-p-bg">
                      <span>
                        Community Spells : {profile?.communityCreationSpells}
                      </span>
                    </div> */}

                    {/* onchain lens data */}
                    {lensProfile && (
                      <>
                        <div className="">
                          <span>Followers: </span>
                          <span className="font-semibold">
                            {lensProfile?.stats?.totalFollowers}
                          </span>
                        </div>
                        <div className="">
                          <span>Following: </span>
                          <span className="font-semibold">
                            {lensProfile?.stats?.totalFollowing}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <BottomDrawerWrapper
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                showClose
                position="bottom"
              >
                <div className="flex flex-col gap-4 mx-4 mb-4">
                  <h3 className="font-bold text-[20px] self-center">
                    {lensProfile?.handle
                      ? `u/${lensProfile?.handle}`
                      : profile?.name}
                  </h3>
                  <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#aaa]">
                    <BiRepost />
                    <span>Posts: {numberOfPosts}</span>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#aaa]">
                    <BsCollection />
                    <span>
                      Collected Posts: {lensProfile?.stats?.totalCollects}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-start text-[18px] text-[#aaa]">
                    <MdOutlineGroups />
                    <span>
                      Joined Communities: {profile?.communities?.length}
                    </span>
                  </div>
                </div>
              </BottomDrawerWrapper>

              {/* lens filter */}

              {
                <div
                  className={`font-bold text-sm sm:text-base flex flex-row  px-3 sm:px-6 bg-white dark:bg-s-bg sm:rounded-xl mt-2 sm:mt-6 py-1 sm:py-3 w-full justify-start space-x-9 items-center ${
                    !isMobile
                      ? 'border-[1px] border-p-border'
                      : 'mb-4 rounded-[10px]'
                  }`}
                >
                  <button
                    className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                      active === 'lens' && 'bg-p-bg'
                    } hover:bg-p-hover hover:text-p-hover-text`}
                    disabled={!lensProfile?.id}
                    onClick={() => {
                      router.push(`/u/${profile?.walletAddress}/feed/lens`)
                    }}
                  >
                    <img
                      src="/lensLogo.svg"
                      alt="lens logo"
                      className="w-5 h-5"
                    />
                    <div>Lens</div>
                  </button>
                  <button
                    className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                      active === 'offchain' && 'bg-p-bg'
                    }  hover:bg-p-btn-hover`}
                    onClick={() => {
                      router.push(`/u/${profile?.walletAddress}/feed/offchain`)
                    }}
                  >
                    <GiBreakingChain className="h-5 w-5" />
                    <div>Off-chain</div>
                  </button>
                  <button
                    className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                      active === 'collected' && 'bg-p-bg'
                    }  hover:bg-p-btn-hover`}
                    disabled={!lensProfile?.id}
                    onClick={() => {
                      router.push(`/u/${profile?.walletAddress}/feed/collected`)
                    }}
                  >
                    <HiCollection className="h-5 w-5" />
                    <div>Collected</div>
                  </button>
                </div>
              }

              {profile.walletAddress && active === 'offchain' && (
                <PostsColumn
                  source="user"
                  data={profile.walletAddress}
                  sortBy="new"
                />
              )}
              {profile.walletAddress &&
                lensProfile?.id &&
                active === 'lens' && (
                  <LensPostsProfilePublicationsColumn
                    profileId={lensProfile?.id}
                  />
                )}
              {lensProfile?.id && active === 'collected' && (
                <LensCollectedPublicationsColumn
                  walletAddress={lensProfile?.ownedBy}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
