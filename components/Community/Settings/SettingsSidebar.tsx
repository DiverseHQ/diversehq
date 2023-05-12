import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { BsFileRuled, BsPeopleFill } from 'react-icons/bs'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { MdAddModerator, MdGroups } from 'react-icons/md'
import { RiUserSettingsLine } from 'react-icons/ri'
import { CommunityType } from '../../../types/community'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import Sidebar from '../../Settings/Sidebar'
import useIsCreator from '../hook/useIsCreator'
import getIPFSLink from '../../User/lib/getIPFSLink'
// import VerifiedBadge from '../../Common/UI/Icon/VerifiedBadge'

const SettingsSidebar = ({ community }: { community: CommunityType }) => {
  const router = useRouter()
  const { name } = router.query
  const { isCreator } = useIsCreator({ name: String(name) })
  return (
    <>
      <div className="w-full flex flex-row items-center my-2 p-2 bg-s-bg rounded-xl border border-s-border">
        <div>
          <ImageWithPulsingLoader
            src={getIPFSLink(community?.logoImageUrl)}
            className="w-10 h-10 rounded-xl object-cover"
          />
        </div>
        <div className="flex flex-col space-y-0.5 ml-2 font-bold ">
          <Link href={`/c/${community?.name}`}>
            <span className="text-p-text hover:underline cursor-pointer">
              c/{community?.name}
            </span>
          </Link>
          <div className="text-s-text text-xs flex flex-row items-center">
            <BsPeopleFill className="w-4 h-4 mr-1" />
            <div>{community?.membersCount}</div>
          </div>
        </div>
      </div>
      <Sidebar
        items={
          isCreator
            ? [
                {
                  title: 'Community',
                  link: `/c/${name}/settings`,
                  icon: (
                    <MdGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                  )
                },
                {
                  title: 'Moderators',
                  link: `/c/${name}/settings/moderators`,
                  icon: (
                    <MdAddModerator className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                  )
                },
                {
                  title: 'Members',
                  link: `/c/${name}/settings/user-management`,
                  icon: (
                    <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                  )
                },
                {
                  title: 'Reported Posts',
                  link: `/c/${name}/settings/reports`,
                  icon: (
                    <HiOutlineDocumentReport className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                  )
                },
                {
                  title: 'Rules',
                  link: `/c/${name}/settings/rules`,
                  icon: (
                    <BsFileRuled className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                  )
                }
                // {
                //   title: 'Verification',
                //   link: `/c/${name}/settings/verification`,
                //   icon: (
                //     <VerifiedBadge className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
                //   ),
                //   disabled: true
                // }
              ]
            : [
                {
                  title: 'User Management',
                  link: `/c/${name}/settings/user-management`,
                  icon: (
                    <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                  )
                },
                {
                  title: 'Reported Posts',
                  link: `/c/${name}/settings/reports`,
                  icon: (
                    <HiOutlineDocumentReport className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
                  )
                }
              ]
        }
      />
    </>
  )
}

export default SettingsSidebar
