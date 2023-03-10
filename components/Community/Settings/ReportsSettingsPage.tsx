import React from 'react'
import { CommunityType } from '../../../types/community'
import MobileTopNavbarWithTitle from '../../Common/MobileTopNavbarWithTitle'
import useDevice from '../../Common/useDevice'
import ReportSection from './Sections/ReportSection'
import SettingsSidebar from './SettingsSidebar'

const ReportsSettingsPage = ({ community }: { community: CommunityType }) => {
  const { isMobile } = useDevice()

  return (
    <>
      {isMobile && <MobileTopNavbarWithTitle title="Reported Posts" />}

      <div className="sm:mx-20 sm:my-12 flex flex-row space-x-20">
        {!isMobile && (
          <div className="w-[300px]">
            <SettingsSidebar community={community} />
          </div>
        )}
        <div className="w-full xl:w-[750px] bg-s-bg text-p-text sm:rounded-xl sm:border-[1px] sm:border-s-border sm:p-4">
          <ReportSection community={community} />
        </div>
      </div>
    </>
  )
}

export default ReportsSettingsPage
