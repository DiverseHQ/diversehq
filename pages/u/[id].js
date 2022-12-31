import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import { getUserInfo } from '../../api/user'
import { useNotify } from '../../components/Common/NotifyContext'
import PostsColumn from '../../components/Post/PostsColumn'
import { useProfile } from '../../components/Common/WalletContext'
import {
  modalType,
  usePopUpModal
} from '../../components/Common/CustomPopUpProvider'
import EditProfile from '../../components/User/EditProfile'
import { isValidEthereumAddress, sleep } from '../../utils/helper.ts'
import {
  ProxyActionStatusTypes,
  useCreateUnfollowTypedDataMutation,
  useDefaultProfileQuery,
  useProfileQuery,
  useProxyActionMutation
} from '../../graphql/generated'
import { proxyActionStatusRequest } from '../../lib/indexer/proxy-action-status'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import LensPostsProfilePublicationsColumn from '../../components/Post/LensPostsProfilePublicationsColumn'
import { useLensUserContext } from '../../lib/LensUserContext'
import { getNumberOfPostsUsingUserAddress } from '../../api/post'

const Profile = () => {
  const { mutateAsync: proxyAction } = useProxyActionMutation()
  const { mutateAsync: unFollow } = useCreateUnfollowTypedDataMutation()
  const { isSignedTx, error, result, type, signTypedDataAndBroadcast } =
    useSignTypedDataAndBroadcast()

  const { id } = useRouter().query
  const [useraddress, setUserAddress] = useState(null)
  const [handle, setHandle] = useState(null)
  const [isFollowedByMe, setIsFollowedByMe] = useState(false)
  const [lensProfile, setLensProfile] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showLensPosts, setShowLensPosts] = useState(false)
  const { notifyInfo } = useNotify()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()

  const [numberOfPosts, setNumberOfPosts] = useState(0)

  const lensProfileQueryFromAddress = useDefaultProfileQuery(
    {
      request: {
        ethereumAddress: useraddress
      }
    },
    {
      // Only fire the query if the address is available.
      enabled: !!useraddress
    }
  )

  const lensProfileFromHandle = useProfileQuery(
    {
      request: {
        handle: handle
      }
    },
    {
      enabled: !!handle
    }
  )

  useEffect(() => {
    if (lensProfile) return

    if (lensProfileQueryFromAddress?.data?.defaultProfile) {
      setLensProfile(lensProfileQueryFromAddress.data.defaultProfile)
    } else if (lensProfileFromHandle?.data?.profile?.ownedBy) {
      setUserAddress(lensProfileFromHandle.data.profile.ownedBy)
      setLensProfile(lensProfileFromHandle.data.profile)
    }
  }, [lensProfileQueryFromAddress, lensProfileFromHandle])

  useEffect(() => {
    if (!lensProfile) return
    setIsFollowedByMe(lensProfile?.isFollowedByMe)
    console.log('lensProfile', lensProfile)
  }, [lensProfile])

  useEffect(() => {
    if (!id || id === '') return
    handleIdAndGetProfile()
  }, [id])

  const handleIdAndGetProfile = async () => {
    if (id.endsWith('.test')) {
      console.log('handle', id)
      //todo get address from lens handle and lens profile
      setHandle(id)
    }
    if (isValidEthereumAddress(id)) {
      setUserAddress(id)
    }
  }

  const getNumberOfPosts = async (address) => {
    const result = await getNumberOfPostsUsingUserAddress(address)
    setNumberOfPosts(result.numberOfPosts)
  }

  useEffect(() => {
    if (useraddress) {
      showUserInfo()
      getNumberOfPosts(useraddress)
    }
  }, [useraddress])

  const showUserInfo = async () => {
    try {
      const userInfo = await getUserInfo(useraddress)
      console.log(userInfo)
      setProfile(userInfo)
    } catch (error) {
      console.log(error)
    }
  }
  const handleWalletAddressCopy = () => {
    navigator.clipboard.writeText(useraddress)
    notifyInfo('Copied to clipboard')
  }
  const handleEditProfile = () => {
    showModal({
      component: <EditProfile user={user} showUserInfo={showUserInfo} />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

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
    if (isSignedTx) {
      console.log('isSignedTx', isSignedTx)
      setIsFollowedByMe(false)
    }
  }, [isSignedTx])

  return (
    <div className="pt-6">
      {profile && (
        <div className="relative">
          <img
            className="h-28 w-full object-cover sm:rounded-t-3xl"
            src={
              profile.bannerImageUrl ? profile.bannerImageUrl : '/gradient.jpg'
            }
          />

          <img
            className="absolute top-20 left-3 sm:left-5 border-s-bg border-4 rounded-full bg-s-bg w-20 h-20"
            src={
              profile?.profileImageUrl
                ? profile?.profileImageUrl
                : '/gradient.jpg'
            }
          />

          <div className="flex flex-col px-3 sm:px-5 mb-5 pb-6 bg-s-bg sm:rounded-b-3xl">
            <div className="flex flex-row items-center self-end">
              {user &&
                user?.walletAddress.toLowerCase() ===
                  useraddress.toLowerCase() && (
                  <div
                    className="text-base text-p-text bg-p-btn px-2 mx-2 rounded-full cursor-pointer"
                    onClick={handleEditProfile}
                  >
                    Edit
                  </div>
                )}
              <div
                className="self-end flex flex-row items-center my-3 px-2 py-1  cursor-pointer"
                onClick={handleWalletAddressCopy}
              >
                <div className="text-base sm:text-xl">
                  {profile?.walletAddress?.substring(0, 6) + '...'}
                </div>
                <FaRegCopy className="w-8 h-8 px-2" />
              </div>
            </div>
            <div className="font-bold text-base sm:text-base tracking-wider">
              {`${profile.name ? profile.name : ''} ${
                lensProfile?.handle ? '@' + lensProfile?.handle : ''
              }`}
            </div>
            <div>{profile.bio}</div>
            <div>
              <span className="text-s-text">Joined </span>
              <span className="font-bold">{profile?.communities?.length}</span>
              <span className="text-s-text"> Communities</span>
            </div>
            <div>
              <span>Post : {numberOfPosts}</span>
            </div>
            {hasProfile && isSignedIn && myLensProfile && (
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
            )}
          </div>
          {lensProfile?.id && (
            <button
              className={`flex flex-row ${showLensPosts && 'bg-s-bg'}`}
              disabled={!lensProfile?.id}
              onClick={() => {
                setShowLensPosts(true)
              }}
            >
              <img src="/lensLogo.svg" alt="lens logo" className="w-5 h-5" />
              <div>Lens</div>
            </button>
          )}

          <div className="w-full flex justify-center">
            <div className="max-w-[650px] shrink-0">
              {useraddress && !showLensPosts && (
                <PostsColumn source="user" data={useraddress} sortBy="new" />
              )}
              {showLensPosts && lensProfile?.id && (
                <LensPostsProfilePublicationsColumn
                  profileId={lensProfile?.id}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
