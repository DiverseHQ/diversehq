import { useEffect, useState } from 'react'
import {
  useCreateUnfollowTypedDataMutation,
  useProfileQuery,
  useProxyActionMutation
} from '../../graphql/generated'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'

const useLensFollowButton = (request) => {
  const { mutateAsync: proxyAction } = useProxyActionMutation()
  const { mutateAsync: unFollow } = useCreateUnfollowTypedDataMutation()
  const { isSignedTx, error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
  const [isFollowedByMe, setIsFollowedByMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data } = useProfileQuery({
    request: request
  })

  useEffect(() => {
    if (!data?.profile) return
    setIsFollowedByMe(!!data?.profile?.isFollowedByMe)
  }, [data])

  const handleFollowProfile = async (profileId) => {
    await proxyAction({
      request: {
        follow: {
          freeFollow: {
            profileId: profileId
          }
        }
      }
    })

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

      signTypedDataAndBroadcast(unfollowProfileResult.typedData, {
        id: unfollowProfileResult.id,
        type: 'unfollow'
      })
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }
  useEffect(() => {
    if (type === 'unfollow' && result) {
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

  return {
    isFollowedByMe,
    setIsFollowedByMe,
    handleFollowProfile,
    handleUnfollowProfile,
    loading
  }
}

export default useLensFollowButton
