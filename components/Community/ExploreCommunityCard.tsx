import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import { isCreatorOrModeratorOfCommunity } from '../../api/community'
// import { useNotify } from '../Common/NotifyContext'
// import { useProfile } from '../Common/WalletContext'
// import { RiMore2Fill } from 'react-icons/ri'
// import { IoIosShareAlt } from 'react-icons/io'
// import MoreOptionsModal from '../Common/UI/MoreOptionsModal'
// import OptionsWrapper from '../Common/OptionsWrapper'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
// import { Tooltip } from '@mui/material'
import { CommunityWithCreatorProfile } from '../../types/community'
// import { FiSettings } from 'react-icons/fi'
import { BsPeopleFill } from 'react-icons/bs'
import { stringToLength } from '../../utils/utils'
import { useDevice } from '../Common/DeviceWrapper'
import useJoinCommunityButton from './hook/useJoinCommunityButton'
import VerifiedBadge from '../Common/UI/Icon/VerifiedBadge'
import getIPFSLink from '../User/lib/getIPFSLink'

interface Props {
  _community: CommunityWithCreatorProfile
}

const ExploreCommunityCard = ({ _community }: Props) => {
  const [community, setCommunity] = useState(_community)
  // const { user } = useProfile()
  // const { notifyInfo } = useNotify()
  // const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()
  // const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false)
  // const [showOptionsModal, setShowOptionsModal] = useState(false)
  const { isMobile } = useDevice()
  const name = community?.name

  const { JoinCommunityButton } = useJoinCommunityButton({
    id: community?._id,
    showJoined: true
  })

  useEffect(() => {
    if (community) {
      setCommunity(_community)
    }
  }, [_community])

  const redirectToCommunityPage = () => {
    if (name) router.push(`/c/${name}`)
  }

  // const shareCommunity = () => {
  //   if (navigator.share) {
  //     navigator.share({
  //       title: `Join c/${community?.name} on DiverseHQ`,
  //       text: `Join c/${community?.name} on DiverseHQ`,
  //       url: `https://diversehq.xyz/c/${community?.name}`
  //     })
  //   } else {
  //     notifyInfo('Sharing is not supported on your device')
  //   }
  // }

  // const checkIfCreatorOrModerator = async (name: string) => {
  //   try {
  //     const res = await isCreatorOrModeratorOfCommunity(name)
  //     if (res.status === 200) {
  //       setIsAuth(true)
  //     } else {
  //       setIsAuth(false)
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // useEffect(() => {
  //   checkIfCreatorOrModerator(community?.name)
  // }, [user?.walletAddress, community?.name])

  return (
    <div
      className={`relative overflow-hidden shadow-lg z-0 bg-s-bg mb-6 text-[#FFF] dark:text-p-text cursor-pointer h-48 sm:h-64 rounded-2xl ${
        !isMobile ? '' : 'mx-2'
      }`}
      onClick={() => {
        redirectToCommunityPage()
      }}
    >
      <ImageWithPulsingLoader
        className={`h-full w-full object-cover rounded-[15px]`}
        src={getIPFSLink(community.bannerImageUrl)}
      />
      <div className="absolute bg-[#ccc] bottom-0 w-full bg-black/70 backdrop-blur-md py-2 sm:py-4 px-2 md:px-4">
        <div className="relative flex flex-row items-start justify-between">
          <div className="flex flex-row gap-4">
            <div className="shrink-0 rounded-[10px]">
              <ImageWithPulsingLoader
                className="rounded-[10px] bg-s-bg w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-cover"
                src={getIPFSLink(community.logoImageUrl)}
              />
            </div>
            {/* {!isMobile && ( */}
            <div className="flex flex-col">
              <div
                className="start-row gap-x-2 font-bold sm:text-2xl  tracking-wider hover:underline cursor-pointer truncate"
                onClick={redirectToCommunityPage}
              >
                <div>{community.name}</div>
                {community?.verified && <VerifiedBadge className="w-4 h-4" />}
              </div>
              <div
                className="text-xs sm:text-base w-full sm:py-0.5"
                style={{
                  lineHeight: '1.1rem'
                }}
              >
                {stringToLength(community.description, 130)}
              </div>
              {/* <div className="flex flex-row flex-wrap gap-8"> */}
              <div className="flex flex-row items-center sm:text-base text-sm space-x-1 sm:space-x-2">
                <BsPeopleFill />
                <span className="font-semibold">{community.membersCount}</span>
              </div>
              {/* </div> */}
            </div>
            {/* )} */}
          </div>
          <div className="flex justify-end items-center gap-1 sm:gap-2">
            <JoinCommunityButton />
            {/* <span onClick={(e) => e.stopPropagation()}>
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
            </span> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreCommunityCard
