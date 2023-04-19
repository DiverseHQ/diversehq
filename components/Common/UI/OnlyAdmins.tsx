import React from 'react'
// import { useLensUserContext } from '../../../lib/LensUserContext'
import LensLoginButton from '../LensLoginButton'
// import { specialProfileIds } from '../../../utils/profileIds'

const OnlyAdmins = () => {
  // const { data: lensProfile } = useLensUserContext()
  // if (specialProfileIds.includes(lensProfile?.defaultProfile?.id)) {
  //   return <>{children}</>
  // }

  return (
    <div className="flex flex-col space-y-10 justify-center items-center w-full h-[100vh] bg-p-bg text-p-text">
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
