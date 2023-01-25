import { useEffect, useState } from 'react'
import {
  useCreateUnfollowTypedDataMutation,
  useProxyActionMutation
} from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'

const useLensFollowButton = (lensProfile) => {
  const { mutateAsync: proxyAction } = useProxyActionMutation()
  const { mutateAsync: unFollow } = useCreateUnfollowTypedDataMutation()
  const { isSignedTx, error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
  const [isFollowedByMe, setIsFollowedByMe] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!lensProfile) return
    setIsFollowedByMe(lensProfile.isFollowedByMe)
  }, [lensProfile])

  const handleFollowProfile = async (profileId) => {
    const followProfileResult = (
      await proxyAction({
        request: {
          follow: {
            freeFollow: {
              profileId: profileId
            }
          }
        }
      })
    ).proxyAction
    console.log('followProfileResult index start', followProfileResult)
    setIsFollowedByMe(true)
  }

  const handleUnfollowProfile = async (profileId) => {
    try {
      setLoading(true)
      const unfollowProfileResult = (
        await unFollow({
          request: {
            profile: profileId
          }
        })
      ).createUnfollowTypedData
      console.log('unfollowProfileResult', unfollowProfileResult)

      signTypedDataAndBroadcast(unfollowProfileResult.typedData, {
        id: unfollowProfileResult.id,
        type: 'unfollow'
      })
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (type === 'unfollow' && result) {
      console.log('Successfully unfollowed', result)
      setLoading(false)
    }
  }, [type, result])

  useEffect(() => {
    if (!error) return
    console.error(error)
    setLoading(false)
  }, [error])

  useEffect(() => {
    if (isSignedTx && type === 'unfollow') {
      console.log('isSignedTx', isSignedTx)
      setLoading(false)
      setIsFollowedByMe(false)
    }
  }, [isSignedTx, type])

  console.log('lensProfile', lensProfile)

  return {
    isFollowedByMe,
    setIsFollowedByMe,
    handleFollowProfile,
    handleUnfollowProfile,
    loading
  }
}

export default useLensFollowButton
