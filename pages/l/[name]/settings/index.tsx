import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import LensCommunitySettingsIndexPage from '../../../../components/LensCommunity/Settings/LensCommunitySettingsIndexPage'
import { useLensUserContext } from '../../../../lib/LensUserContext'
import { LensCommunity } from '../../../../types/community'

const index = () => {
  const { LensCommunity: l } = useProfile()
  const { data: profile } = useLensUserContext()
  const LensCommunity: LensCommunity = {
    ...l,
    //@ts-ignore
    Profile: profile?.defaultProfile
  }
  return (
    <LensAuthCommunity>
      <LensCommunitySettingsIndexPage community={LensCommunity} />
    </LensAuthCommunity>
  )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { name } = context.params
//   const { data } = context.query
//   if (data) {
//     return {
//       props: {
//         community: JSON.parse(String(data))
//       }
//     }
//   }

//   const res = await getLensCommunity(`${name}${HANDLE_SUFFIX}`)
//   if (res.status === 200) {
//     const lensCommunity = await res.json()
//     const communityLensProfile = await getLensProfileInfo({
//       handle: `${name}${HANDLE_SUFFIX}`
//     })
//     if (!communityLensProfile?.profile) {
//       return {
//         props: {
//           community: null
//         }
//       }
//     }
//     return {
//       props: {
//         community: {
//           ...lensCommunity,
//           Profile: communityLensProfile.profile
//         }
//       }
//     }
//   } else {
//     return {
//       props: {
//         community: null
//       }
//     }
//   }
// }

export default index
