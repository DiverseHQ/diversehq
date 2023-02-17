import { CircularProgress } from '@mui/material'
import React from 'react'
import useLensFollowButton from './useLensFollowButton'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
const LensFollowButton = ({ lensProfile }) => {
  if (!lensProfile) return <></>
  const {
    isFollowedByMe,
    handleFollowProfile,
    handleUnfollowProfile,
    loading
  } = useLensFollowButton({ profileId: lensProfile?.id })
  return {
    isFollowedByMe,
    loading,
    FollowButton: () => (
      <>
        {lensProfile && isFollowedByMe ? (
          <button
            onClick={() => {
              handleUnfollowProfile(lensProfile.id)
            }}
            className="bg-p-btn text-p-btn-text rounded-md px-3 py-1 text-sm font-semibold w-full"
          >
            {loading ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <CircularProgress size="18px" color="primary" />
                <p>UnFollow</p>
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center space-x-1 ">
                <RiUserUnfollowLine /> <p>UnFollow</p>
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              handleFollowProfile(lensProfile.id)
            }}
            className="bg-p-btn text-p-btn-text rounded-md px-3 py-1 text-sm font-semibold w-full"
          >
            {loading ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <CircularProgress size="18px" color="primary" />
                <p>Follow</p>
              </div>
            ) : lensProfile.isFollowing ? (
              'Follow back'
            ) : (
              <div className="flex flex-row justify-center items-center space-x-1 ">
                <RiUserFollowLine /> <p>Follow</p>
              </div>
            )}
          </button>
        )}
      </>
    )
  }
}

export default LensFollowButton
