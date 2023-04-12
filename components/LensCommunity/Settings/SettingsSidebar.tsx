import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { BsFileRuled, BsPeopleFill } from 'react-icons/bs'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { MdGroups } from 'react-icons/md'
import { RiUserSettingsLine } from 'react-icons/ri'
import { VscOpenPreview } from 'react-icons/vsc'
import { LensCommunity } from '../../../types/community'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import Sidebar from '../../Settings/Sidebar'
import formatHandle from '../../User/lib/formatHandle'
import getAvatar from '../../User/lib/getAvatar'
import VerifiedBadge from '../../Common/UI/Icon/VerifiedBadge'

const SettingsSidebar = ({ community }: { community: LensCommunity }) => {
  const router = useRouter()
  const { name } = router.query

  return (
    <>
      <div className="w-full flex flex-row items-center my-2 p-2 bg-s-bg rounded-xl border border-s-border">
        <div>
          <ImageWithPulsingLoader
            src={getAvatar(community?.Profile)}
            className="w-10 h-10 rounded-xl object-cover"
          />
        </div>
        <div className="flex flex-col space-y-0.5 ml-2 font-bold ">
          <Link href={`/l/${formatHandle(community?.Profile?.handle)}`}>
            <span className="text-p-text hover:underline cursor-pointer">
              l/{formatHandle(community?.Profile?.handle)}
            </span>
          </Link>
          <div className="text-s-text text-xs flex flex-row items-center">
            <BsPeopleFill className="w-4 h-4 mr-1" />
            <div>{community?.Profile?.stats?.totalFollowers}</div>
          </div>
        </div>
      </div>
      <Sidebar
        items={[
          {
            title: 'Community',
            link: `/l/${name}/settings`,
            icon: (
              <MdGroups className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            )
          },
          {
            title: 'Members',
            link: `/l/${name}/settings/user-management`,
            icon: (
              <RiUserSettingsLine className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            )
          },
          {
            title: 'Review Post Requests',
            link: `/l/${name}/settings/review-posts`,
            icon: (
              <VscOpenPreview className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            )
          },
          {
            title: 'Reported Posts',
            link: `/l/${name}/settings/reports`,
            icon: (
              <HiOutlineDocumentReport className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            )
          },
          {
            title: 'Rules',
            link: `/l/${name}/settings/rules`,
            icon: (
              <BsFileRuled className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
            )
          },
          {
            title: 'Verification',
            link: `/l/${name}/settings/verification`,
            icon: (
              <VerifiedBadge className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
            ),
            disabled: true
          }
        ]}
      />
    </>
  )
}

export default SettingsSidebar
