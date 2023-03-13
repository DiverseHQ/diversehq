import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { isCreatorOrModeratorOfCommunity } from '../../api/community'
import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import useDevice from '../Common/useDevice'
import { RiMore2Fill } from 'react-icons/ri'
import { IoIosShareAlt } from 'react-icons/io'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
import OptionsWrapper from '../Common/OptionsWrapper'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { Tooltip } from '@mui/material'
import JoinCommunityButton from './JoinCommunityButton'
import { CommunityWithCreatorProfile } from '../../types/community'
import { FiSettings } from 'react-icons/fi'

interface Props {
  _community: CommunityWithCreatorProfile
}

const ExploreCommunityCard = ({ _community }: Props) => {
  const [community, setCommunity] = useState(_community)
  const { user } = useProfile()
  const { notifyInfo } = useNotify()
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { isMobile } = useDevice()
  const name = community?.name

  useEffect(() => {
    if (community) {
      setCommunity(_community)
    }
  }, [_community])

  const redirectToCommunityPage = () => {
    if (name) router.push(`/c/${name}`)
  }

  const shareCommunity = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${community?.name} on ${process.env.NEXT_PUBLIC_APP_NAME}`,
        text: `Join ${community?.name} on ${process.env.NEXT_PUBLIC_APP_NAME}`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/c/${community?.name}`
      })
    } else {
      notifyInfo('Sharing is not supported on your device')
    }
  }

  const checkIfCreatorOrModerator = async (name: string) => {
    try {
      const res = await isCreatorOrModeratorOfCommunity(name)
      if (res.status === 200) {
        setIsAuth(true)
      } else {
        setIsAuth(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    checkIfCreatorOrModerator(community?.name)
  }, [user?.walletAddress, community?.name])

  return (
    <div
      className={`relative shadow-lg z-0 bg-s-bg mb-6 text-[#FFF] dark:text-p-text cursor-pointer h-60 sm:min-h-72 sm:h-72 rounded-[15px] ${
        !isMobile ? '' : 'mx-2'
      }`}
      onClick={() => {
        redirectToCommunityPage()
      }}
    >
      <ImageWithPulsingLoader
        className={`h-full w-full object-cover rounded-[15px]`}
        src={community.bannerImageUrl}
      />
      <div className="absolute bg-[#ccc] bottom-0 w-full rounded-b-[15px] bg-black/70 backdrop-blur-md py-4 px-2 md:px-4">
        <div className="relative flex flex-row items-start justify-between">
          <div className="flex flex-row gap-4">
            <div className="shrink-0 rounded-[10px]">
              <ImageWithPulsingLoader
                className="rounded-[10px] bg-s-bg w-[60px] h-[60px] md:w-[100px] md:h-[100px] object-cover"
                src={community.logoImageUrl}
              />
            </div>
            {!isMobile && (
              <div className="flex flex-col">
                <p
                  className="font-bold text-2xl tracking-wider hover:underline cursor-pointer truncate"
                  onClick={redirectToCommunityPage}
                >
                  {community.name}
                </p>
                <div className="text-[16px] mb-6">{community.description}</div>
                <div className="flex flex-row flex-wrap gap-8">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {community.members?.length}
                    </span>
                    <span className="text-[14px]">members</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {community.members?.length}
                    </span>
                    <span className="text-[14px]">members</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end items-center gap-1 sm:gap-2">
            <JoinCommunityButton id={community._id} showJoined={true} />
            <span onClick={(e) => e.stopPropagation()}>
              <OptionsWrapper
                OptionPopUpModal={() => (
                  <MoreOptionsModal
                    className="z-50"
                    list={
                      isAuth
                        ? [
                            {
                              label: 'Setting',
                              onClick: () => {
                                router.push(`/c/${community.name}/settings`)
                              },
                              icon: () => (
                                <FiSettings className="mr-1.5 w-6 h-6" />
                              )
                            },
                            {
                              label: 'Share',
                              onClick: shareCommunity,
                              icon: () => (
                                <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                              )
                            }
                          ]
                        : [
                            {
                              label: 'Share',
                              onClick: shareCommunity,
                              icon: () => (
                                <IoIosShareAlt className="mr-1.5 w-6 h-6" />
                              )
                            }
                          ]
                    }
                  />
                )}
                position="left"
                showOptionsModal={showOptionsModal}
                setShowOptionsModal={setShowOptionsModal}
                isDrawerOpen={isExploreDrawerOpen}
                setIsDrawerOpen={setIsExploreDrawerOpen}
              >
                <Tooltip enterDelay={1000} leaveDelay={200} title="More" arrow>
                  <div className="hover:bg-p-btn-hover rounded-md p-1.5 cursor-pointer">
                    <RiMore2Fill className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </Tooltip>
              </OptionsWrapper>
            </span>
          </div>
        </div>
        {isMobile && (
          <>
            {/* name and description row */}
            <div className="flex flex-col mt-1">
              <p
                className="font-bold text-[18px] tracking-wider hover:underline cursor-pointer truncate"
                onClick={redirectToCommunityPage}
              >
                {community.name}
              </p>
              <p className="text-[14px]">
                <span className="font-semibold">
                  {community.members?.length}
                </span>{' '}
                Members
              </p>
              <div className="text-[14px]">{community.description}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ExploreCommunityCard
