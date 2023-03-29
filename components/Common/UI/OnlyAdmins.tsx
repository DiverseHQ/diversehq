import React from 'react'
import { useLensUserContext } from '../../../lib/LensUserContext'
import LensLoginButton from '../LensLoginButton'

const ALLOWED_PROFILE_IDS = ['0x5ec3', '0x0161ba', '0x01abf2', '0xd478']

const OnlyAdmins = ({ children }) => {
  const { data: lensProfile } = useLensUserContext()
  if (ALLOWED_PROFILE_IDS.includes(lensProfile?.defaultProfile?.id)) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col space-y-10 justify-center items-center w-full h-[100vh]">
      <div>
        {' '}
        {` 
    if your are admin login else wait for 1.04.2023
`}{' '}
      </div>

      <LensLoginButton />
    </div>
  )
}

export default OnlyAdmins
