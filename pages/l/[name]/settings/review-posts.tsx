import React from 'react'
import { useProfile } from '../../../../components/Common/WalletContext'
import LensAuthCommunity from '../../../../components/LensCommunity/LensAuthCommunity'
import LensCommunityReviewPostsPage from '../../../../components/LensCommunity/Settings/LensCommunityReviewPostsPage'
import { useLensUserContext } from '../../../../lib/LensUserContext'
import { LensCommunity } from '../../../../types/community'

const ReviewPosts = () => {
  const { LensCommunity: l } = useProfile()
  const { data: profile } = useLensUserContext()
  const community: LensCommunity = {
    ...l,
    //@ts-ignore
    Profile: profile?.defaultProfile
  }
  return (
    <LensAuthCommunity>
      <LensCommunityReviewPostsPage community={community} />
    </LensAuthCommunity>
  )
}

export default ReviewPosts