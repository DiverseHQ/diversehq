import { useEffect, useState } from 'react'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { SlUserFollowing } from 'react-icons/sl'
import {
  ProfileRequest,
  useFollowMutation,
  useProfileQuery,
  useUnfollowMutation
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useNotify } from '../Common/NotifyContext'
import formatHandle from './lib/formatHandle'
import checkDispatcherPermissions from '../../lib/profile/checkPermission'

interface followSteps {
  UnFollow: string
  Follow: string
  Following: string
  FollowBack: string
}

const useLensFollowButton = (
  request: ProfileRequest,
  label: string = 'follow'
) => {
  const FOLLOW_STATUS: {
    [key: string]: followSteps
  } = {
    follow: {
      UnFollow: 'UnFollow',
      Follow: 'Follow',
      Following: 'Following',
      FollowBack: 'Follow back'
    } as followSteps,
    join: {
      UnFollow: 'Leave',
      Follow: 'Join',
      Following: 'Joined',
      FollowBack: 'Join'
    } as followSteps
  }
  const { isSignedTx, error, result, type } = useSignTypedDataAndBroadcast()
  const [isFollowedByMe, setIsFollowedByMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const { notifySuccess, notifyError } = useNotify()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()
  const { mutateAsync: follow } = useFollowMutation()
  const { mutateAsync: unFollow } = useUnfollowMutation()

  const { canUseLensManager } = checkDispatcherPermissions(
    lensProfile?.defaultProfile
  )

  const { data } = useProfileQuery(
    {
      request: request
    },
    {
      enabled:
        isSignedIn &&
        hasProfile &&
        (Boolean(request.forProfileId) || Boolean(request.forHandle))
    }
  )

  useEffect(() => {
    if (!data?.profile) return
    setIsFollowedByMe(!!data?.profile?.operations?.isFollowedByMe?.value)
  }, [data])

  const handleFollowProfile = async (profileId) => {
    try {
      setLoading(true)
      if (!canUseLensManager) {
        setLoading(false)
        notifyError('You are not using a Lens Manager')
        return
      }
      const followRequest = (
        await follow({
          request: {
            follow: profileId
          }
        })
      ).follow

      if (followRequest?.__typename === 'LensProfileManagerRelayError') {
        setLoading(false)
        notifyError(followRequest?.reason)
        return
      }

      setIsFollowedByMe(true)
      if (label === 'follow') {
        // @ts-ignore
        notifySuccess(`Following u/${formatHandle(data?.profile?.handle)}`)
      } else {
        // @ts-ignore
        notifySuccess(`Joined l/${formatHandle(data?.profile?.handle)}`)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
      notifyError('Error Following the Profile')
    }
  }

  const handleUnfollowProfile = async (profileId) => {
    try {
      setLoading(true)
      if (!canUseLensManager) {
        notifyError('You are not using a Lens Manager')
        return
      }
      const unfollowProfileResult = (
        await unFollow({
          request: {
            unfollow: profileId
          }
        })
      ).unfollow

      if (
        unfollowProfileResult?.__typename === 'LensProfileManagerRelayError'
      ) {
        setLoading(false)
        notifyError(unfollowProfileResult?.reason)
        return
      }

      // @ts-ignore
      notifySuccess(`UnFollowed u/${formatHandle(data?.profile?.handle)}`)

      // signTypedDataAndBroadcast(unfollowProfileResult.typedData, {
      //   id: unfollowProfileResult.id,
      //   type: 'unfollow'
      // })
    } catch (e) {
      setLoading(false)
      notifyError('You are not Following this Profile')
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
      setLoading(false)
      setIsFollowedByMe(false)
      if (label === 'follow') {
        // @ts-ignore
        notifySuccess(`UnFollowed u/${formatHandle(data?.profile?.handle)}`)
      } else {
        // @ts-ignore
        notifySuccess(`Left l/${formatHandle(data?.profile?.handle)}`)
      }
    }
  }, [isSignedTx, type])

  // label options 'follow' & 'join'
  const FollowButton = ({
    className = '',
    hideIfFollow = false
  }: {
    className?: string
    hideIfFollow?: boolean
  }) => {
    if (!isSignedIn || !hasProfile) return null

    if (data?.profile && isFollowedByMe && hideIfFollow) return null
    return (
      <>
        {data?.profile && isFollowedByMe ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleUnfollowProfile(data?.profile?.id)
            }}
            className={`${
              className ? className : 'rounded-md'
            } group/text bg-s-bg text-p-btn hover:bg-p-btn hover:text-p-btn-text hover:border-bg-p-btn border-[1px] border-p-btn px-3 py-1 text-sm font-semibold w-full`}
          >
            {loading ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <div className="h-4 w-4 border-p-text spinner" />
                <p>{FOLLOW_STATUS[label].UnFollow}</p>
              </div>
            ) : (
              <>
                <div className="hidden group-hover/text:flex flex-row justify-center items-center space-x-2">
                  <RiUserUnfollowLine /> <p>{FOLLOW_STATUS[label].UnFollow}</p>
                </div>
                <div className="group-hover/text:hidden flex flex-row justify-center items-center space-x-2 ">
                  <SlUserFollowing /> <p>{FOLLOW_STATUS[label].Following}</p>
                </div>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleFollowProfile(data?.profile?.id)
            }}
            className={`${
              className ? className : 'rounded-md'
            } bg-p-btn text-p-btn-text px-3 py-1 text-sm font-semibold w-full`}
          >
            {loading ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <div className="h-4 w-4 border-p-btn-text spinner" />
                <p>{FOLLOW_STATUS[label].Follow}</p>
              </div>
            ) : data?.profile?.operations?.isFollowingMe?.value ? (
              <>{FOLLOW_STATUS[label].FollowBack}</>
            ) : (
              <div className="flex flex-row justify-center items-center space-x-1 ">
                <RiUserFollowLine /> <p>{FOLLOW_STATUS[label].Follow}</p>
              </div>
            )}
          </button>
        )}
      </>
    )
  }

  return {
    isFollowedByMe,
    setIsFollowedByMe,
    handleFollowProfile,
    handleUnfollowProfile,
    loading,
    FollowButton
  }
}

export default useLensFollowButton
