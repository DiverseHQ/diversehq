import React from 'react'
import useLensFollowButton from './useLensFollowButton'

const LensFollowButton = ({ lensProfile }) => {
  const {
    isFollowedByMe,
    handleFollowProfile,
    handleUnfollowProfile,
    loading
  } = useLensFollowButton({ profileId: lensProfile.id })
  return (
    <>
      {lensProfile && isFollowedByMe ? (
        <button
          onClick={() => {
            handleUnfollowProfile(lensProfile.id)
          }}
          className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
        >
          {loading ? 'Unfollowing' : 'Unfollow'}
        </button>
      ) : (
        <button
          onClick={() => {
            handleFollowProfile(lensProfile.id)
          }}
          className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
        >
          {loading
            ? 'Following'
            : lensProfile.isFollowing
            ? 'Follow back'
            : 'Follow'}
        </button>
      )}
    </>
  )
}

export default LensFollowButton
