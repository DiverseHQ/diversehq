import React, { useEffect, useState } from 'react'
import {
  ProxyActionStatusTypes,
  useCreateUnfollowTypedDataMutation,
  useProxyActionMutation
} from '../../graphql/generated'
import { sleep } from '../../lib/helpers'
import { proxyActionStatusRequest } from '../../lib/indexer/proxy-action-status'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'

const LensFollowButton = ({ lensProfile }) => {
  const { mutateAsync: proxyAction } = useProxyActionMutation()
  const { mutateAsync: unFollow } = useCreateUnfollowTypedDataMutation()
  const { isSignedTx, error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()

  const [isFollowedByMe, setIsFollowedByMe] = useState(false)

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

    // waiting untill proxy action is complete
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const statusResult = await proxyActionStatusRequest(followProfileResult)
        console.log('statusResult', statusResult)
        if (statusResult.status === ProxyActionStatusTypes.Complete) {
          console.log('proxy action free follow: complete', statusResult)
          break
        }
      } catch (e) {
        console.error(e)
        break
      }
      await sleep(1000)
    }

    console.log('followProfileResult index end', followProfileResult)
  }

  const handleUnfollowProfile = async (profileId) => {
    try {
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
    }
  }, [type, result])

  useEffect(() => {
    if (!error) return
    console.error(error)
  }, [error])

  useEffect(() => {
    if (isSignedTx && type === 'unfollow') {
      console.log('isSignedTx', isSignedTx)
      setIsFollowedByMe(false)
    }
  }, [isSignedTx, type])

  return (
    <>
      {lensProfile && isFollowedByMe ? (
        <button
          onClick={() => {
            handleUnfollowProfile(lensProfile.id)
          }}
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={() => {
            handleFollowProfile(lensProfile.id)
          }}
        >
          Follow
        </button>
      )}
    </>
  )
}

export default LensFollowButton
