// import { useRouter } from 'next/router'
// import React from 'react'
// import { useLensUserContext } from '../../lib/LensUserContext'
// import formatHandle from '../User/lib/formatHandle'
// // import { LensCommunity } from '../../types/community'

// const LensAuthCommunity = ({ children }) => {
//   const { data: lensProfile } = useLensUserContext()
//   if (!lensProfile) return null
//   const router = useRouter()
//   if (
//     router.query?.name &&
//     router.query?.name !== formatHandle(lensProfile?.defaultProfile?.handle)
//   )
//     return null
//   return <>{children}</>
// }

// export default LensAuthCommunity
