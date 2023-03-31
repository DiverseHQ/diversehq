import React, { FC } from 'react'
import { Profile } from '../../graphql/generated'
import { UserType } from '../../types/user'
import Markup from '../Lexical/Markup'
import ProfileLinksRow from './ProfileLinksRow'

interface Props {
  profile: UserType
  lensProfile: Profile
}

const ProfilePageRightSidebar: FC<Props> = ({ profile, lensProfile }) => {
  return (
    <div
      className={`relative hidden lg:flex flex-col w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-8 pr-4 pl-2 md:pl-2 lg:pl-4 xl:pl-6 overflow-scroll no-scrollbar space-y-3`}
    >
      {/* About profile card */}
      <div className="flex flex-col bg-s-bg w-full rounded-[15px] border-[1px] border-s-border text-[#fff]">
        <div className="bg-[#9378d8] rounded-t-[15px] font-medium px-3 py-2">
          About Profile
        </div>
        <div className="text-p-text px-3 py-2 flex flex-col text-[14px]">
          <div className="mb-3">
            <Markup>{lensProfile.bio}</Markup>
          </div>
          <div className="flex gap-2 items-center mb-2">
            <img src="/communityCreatedOnDate.svg" alt="cake" />
            <span className="text-[#7c7c7c]">
              Joined{' '}
              {new Date(profile.createdAt)
                .toDateString()
                .split(' ')
                .slice(1)
                .join(' ')}
            </span>
          </div>
          <div className="bg-s-border h-[1px] mb-3"></div>
          <div className="flex flex-wrap mb-2 gap-x-6 gap-y-2 justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                {profile?.communities?.length}
              </span>
              <span className="font-light text-[#7c7c7c]">communities</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                {Number(lensProfile?.stats?.totalPosts)}
              </span>
              <span className="font-light text-[#7c7c7c]">posts</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                {Number(lensProfile?.stats?.totalCollects)}
              </span>
              <span className="font-light text-[#7c7c7c]">collects</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                {Number(lensProfile?.stats?.totalMirrors)}
              </span>
              <span className="font-light text-[#7c7c7c]">mirrors</span>
            </div>
          </div>
          <ProfileLinksRow profile={lensProfile} />
        </div>
      </div>
    </div>
  )
}

export default ProfilePageRightSidebar
