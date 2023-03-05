import React from 'react'
import MobileTopNavbarWithTitle from '../../Common/MobileTopNavbarWithTitle'
import useDevice from '../../Common/useDevice'
import VerificationSection from './Sections/VerificationSection'
import SettingsSidebar from './SettingsSidebar'

const VerificationPage = () => {
  const { isMobile } = useDevice()
  return (
    <>
      {isMobile && <MobileTopNavbarWithTitle title="Assign Mods" />}

      <div className="sm:mx-20 sm:my-12 flex flex-row space-x-20">
        {!isMobile && (
          <div className="w-[300px]">
            <SettingsSidebar />
          </div>
        )}
        <div className="w-full xl:w-[750px] bg-s-bg text-p-text  sm:rounded-xl sm:border-[1px] sm:border-s-border sm:p-4">
          <VerificationSection />
        </div>
      </div>
    </>
  )
}

export default VerificationPage
