import React from 'react'
import FilterRow from '../../Common/UI/FilterRow'
import FilterButton from '../../Common/UI/FilterButton'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { useRouter } from 'next/router'
import { GoMention } from 'react-icons/go'
import { FaRegCommentDots } from 'react-icons/fa'
import { useProfile } from '../../Common/WalletContext'
import { Switch } from '@mui/material'
import { toggleHighSignalNotifsPreference } from '../../../api/user'
import { useDevice } from '../../Common/DeviceWrapper'

const NotificationFilter = () => {
  const { pathname } = useRouter()
  const { user, refreshUserInfo } = useProfile()
  const { isMobile } = useDevice()

  if (!user) return null

  return (
    <FilterRow
      EndButton={
        <div className="start-row">
          <div className="text-xs font-normal sm:text-base ">
            {isMobile ? 'High Signal' : 'High Signal'}
          </div>
          <Switch
            checked={user?.preferences?.highSignalNotifications}
            onChange={async () => {
              await toggleHighSignalNotifsPreference()
              await refreshUserInfo()
            }}
            size="small"
            sx={{
              '& .MuiSwitch-track': {
                backgroundColor: 'grey',
                color: 'grey'
              }
            }}
          />
        </div>
      }
    >
      <FilterButton
        Icon={<IoMdNotificationsOutline />}
        title="All"
        active={pathname === '/notification'}
        tooltipTitle="All Notifications"
        link="/notification"
      />

      <FilterButton
        Icon={<GoMention />}
        title="Mentions"
        active={pathname === '/notification/mentions'}
        tooltipTitle="Mentions"
        link="/notification/mentions"
      />

      <FilterButton
        Icon={<FaRegCommentDots />}
        title="Comments"
        active={pathname === '/notification/comments'}
        tooltipTitle="Mentions"
        link="/notification/comments"
      />
    </FilterRow>
  )
}

export default NotificationFilter
