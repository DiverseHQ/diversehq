import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { SlUserFollowing } from 'react-icons/sl'
import {
  SingleProfileQueryRequest,
  useCreateUnfollowTypedDataMutation,
  useProfileQuery,
  useProxyActionMutation
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import { useNotify } from '../Common/NotifyContext'
import formatHandle from './lib/formatHandle'

interface followSteps {
  UnFollow: string
  Follow: string
  Following: string
  FollowBack: string
}

const useLensFollowButton = (
  request: SingleProfileQueryRequest,
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
  const { mutateAsync: proxyAction } = useProxyActionMutation()
  const { mutateAsync: unFollow } = useCreateUnfollowTypedDataMutation()
  const { isSignedTx, error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()
  const [isFollowedByMe, setIsFollowedByMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const { notifySuccess, notifyError } = useNotify()
  const { isSignedIn, hasProfile } = useLensUserContext()

  const { data } = useProfileQuery(
    {
      request: request
    },
    {
      enabled:
        isSignedIn &&
        hasProfile &&
        (Boolean(request.profileId) || Boolean(request.handle))
    }
  )

  useEffect(() => {
    if (!data?.profile) return
    setIsFollowedByMe(!!data?.profile?.isFollowedByMe)
  }, [data])

  const handleFollowProfile = async (profileId) => {
    try {
      setLoading(true)
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
      if (label === 'follow') {
        notifySuccess(`Following u/${formatHandle(data?.profile?.handle)}`)
      } else {
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
        notifySuccess(`UnFollowed u/${formatHandle(data?.profile?.handle)}`)
      } else {
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
                <CircularProgress size="18px" color="primary" />
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
                <CircularProgress size="18px" color="primary" />
                <p>{FOLLOW_STATUS[label].Follow}</p>
              </div>
            ) : data?.profile?.isFollowing ? (
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
