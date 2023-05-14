import React from 'react'
import { WhoReactedResult } from '../../../graphql/generated'

const ReactionProfileCard = ({
  reactionProfile
}: {
  reactionProfile: WhoReactedResult
}) => {
  return <div className="my-12">{reactionProfile?.profile?.handle}</div>
}

export default ReactionProfileCard
