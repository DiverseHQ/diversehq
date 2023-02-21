import React from 'react'
import { CgProfile } from 'react-icons/cg'
import { FiSettings } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import Sidebar from './Sidebar'

const CommonSidebar = () => {
  return (
    <Sidebar
      items={[
        {
          title: 'Profile',
          link: '/settings',
          icon: (
            <CgProfile className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
          )
        },
        {
          title: 'Preferences',
          link: '/settings/preferences',
          icon: (
            <FiSettings className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
          ),
          disabled: true
        },
        {
          title: 'Verification',
          link: '/settings/verification',
          icon: (
            <MdVerified className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain" />
          ),
          disabled: true
        }
      ]}
    />
  )
}

export default CommonSidebar
