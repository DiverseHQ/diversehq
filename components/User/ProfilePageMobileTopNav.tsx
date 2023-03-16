import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { Profile } from '../../graphql/generated'
import MobileTopNavbarWithTitle from '../Common/MobileTopNavbarWithTitle'
import MessageButton from '../Messages/MessageButton'
import formatHandle from './lib/formatHandle'
import useLensFollowButton from './useLensFollowButton'

interface Props {
  _lensProfile: Profile
}

const ProfilePageMobileTopNav: FC<Props> = ({ _lensProfile }) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const router = useRouter()
  const { isFollowedByMe } = useLensFollowButton({
    profileId: _lensProfile?.id
  })

  const handleScroll = () => {
    setScrollPosition(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {scrollPosition > 100 ? (
        <MobileTopNavbarWithTitle
          title={`u/${formatHandle(_lensProfile?.handle)}` || 'Profile'}
        />
      ) : (
        <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm absolute top-0 w-full z-30 min-h-[50px]">
          <div className="flex items-center justify-center w-8 h-8 bg-p-btn-hover rounded-full">
            <BiArrowBack
              onClick={() => router.back()}
              className="w-6 h-6 rounded-full cursor-pointer"
            />
          </div>
          <div className="flex">
            {isFollowedByMe && (
              <MessageButton
                userLensProfile={_lensProfile}
                className="bg-p-btn-hover"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePageMobileTopNav
